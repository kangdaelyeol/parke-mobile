#!/usr/bin/env node
/**
 * src 안 모듈의 순환 참조(import 고리)를 찾는다. 고리가 있으면 목록을 보여주고 실패한다.
 *
 * 고리가 있으면 먼저 실행된 쪽에서 상대 모듈 값이 아직 undefined다.
 * 렌더 중에만 꺼내 쓰면 우연히 동작하지만, 모듈 맨 위에서 쓰는 순간(themed({...}), StyleSheet.create 등)
 * 화면이 깨지거나 앱이 시작하자마자 죽는다.
 *
 * 고치는 법
 * - 같은 폴더 안에서는 자기 폴더 index(@home/components 등)가 아니라 형제 파일을 상대 경로로 가져온다
 * - 타입만 가져오면 import type 으로 쓴다 (실행 때 사라져 고리가 되지 않는다)
 *
 * 경로 별칭은 tsconfig.json의 paths를 그대로 쓴다. 실행: npm run check:cycles
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'src')
const { compilerOptions } = require(path.join(ROOT, 'tsconfig.json'))

// "@home/*": ["./src/screens/home/*"] → { prefix: '@home/', dir: <ROOT>/src/screens/home/ }
const ALIASES = Object.entries(compilerOptions.paths)
  .map(([key, [target]]) => ({
    prefix: key.replace(/\*$/, ''),
    dir: path.join(ROOT, target.replace(/\*$/, '')),
  }))
  .sort((a, b) => b.prefix.length - a.prefix.length)

// import/export ... from '...' (여러 줄 포함). import type / export type 은 세지 않는다
const IMPORT_RE =
  /^\s*(?:import|export)\s+(?!type\b)(?:[^'"]*?\sfrom\s+)?['"]([^'"]+)['"]/gm
const CANDIDATES = ['', '.ts', '.tsx', '/index.ts', '/index.tsx']

const listFiles = dir =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return listFiles(full)
    return /\.tsx?$/.test(entry.name) && !entry.name.endsWith('.d.ts')
      ? [full]
      : []
  })

const resolve = (fromDir, spec) => {
  let base = null
  if (spec.startsWith('.')) base = path.resolve(fromDir, spec)
  else {
    const alias = ALIASES.find(a => spec.startsWith(a.prefix))
    if (alias) base = path.join(alias.dir, spec.slice(alias.prefix.length))
  }
  if (!base) return null
  const found = CANDIDATES.map(ext => base + ext).find(
    file => fs.existsSync(file) && fs.statSync(file).isFile(),
  )
  return found ?? null
}

const files = listFiles(SRC)
const graph = new Map(
  files.map(file => {
    const text = fs.readFileSync(file, 'utf8')
    const deps = new Set()
    for (const match of text.matchAll(IMPORT_RE)) {
      const dep = resolve(path.dirname(file), match[1])
      if (dep) deps.add(dep)
    }
    return [file, deps]
  }),
)

// 강하게 연결된 묶음(Tarjan): 크기가 2 이상이거나 자기 자신을 가져오면 고리
const groups = []
let counter = 0
const index = new Map()
const low = new Map()
const stack = []
const onStack = new Set()
const visit = node => {
  index.set(node, counter)
  low.set(node, counter)
  counter += 1
  stack.push(node)
  onStack.add(node)
  for (const next of graph.get(node) ?? []) {
    if (!index.has(next)) {
      visit(next)
      low.set(node, Math.min(low.get(node), low.get(next)))
    } else if (onStack.has(next)) {
      low.set(node, Math.min(low.get(node), index.get(next)))
    }
  }
  if (low.get(node) !== index.get(node)) return
  const group = []
  let member
  do {
    member = stack.pop()
    onStack.delete(member)
    group.push(member)
  } while (member !== node)
  if (group.length > 1 || graph.get(node)?.has(node)) groups.push(group)
}
files.forEach(file => index.has(file) || visit(file))

// 묶음 안에서 시작 파일로 돌아오는 가장 짧은 고리 하나 (고칠 곳을 바로 보여준다)
const shortestCycle = group => {
  const members = new Set(group)
  const start = [...group].sort()[0]
  const prev = new Map([[start, null]])
  const queue = [start]
  while (queue.length) {
    const node = queue.shift()
    for (const next of graph.get(node) ?? []) {
      if (!members.has(next)) continue
      if (next === start) {
        const cycle = [start]
        for (let n = node; n !== start; n = prev.get(n)) cycle.splice(1, 0, n)
        return [...cycle, start]
      }
      if (!prev.has(next)) {
        prev.set(next, node)
        queue.push(next)
      }
    }
  }
  return [start]
}

const rel = file => path.relative(ROOT, file)
if (groups.length === 0) {
  console.log(`순환 참조 없음 (${files.length}개 파일)`)
  process.exit(0)
}
console.error(`순환 참조 ${groups.length}묶음:\n`)
groups.forEach(group => {
  console.error(`- ${group.length}개 파일: ${shortestCycle(group).map(rel).join(' → ')}`)
})
console.error(
  '\n같은 폴더는 형제 파일을 상대 경로로, 타입만 쓰면 import type 으로 가져오세요.',
)
process.exit(1)
