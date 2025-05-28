import fs from 'fs'
import path from 'path'

import js from '@eslint/js'
import eslintPluginImport from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import vuePlugin from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

// 读取自动导入的变量定义
let autoImportGlobals = {}
try {
  const autoImportPath = path.resolve('.eslintrc-auto-import.json')
  if (fs.existsSync(autoImportPath)) {
    autoImportGlobals = JSON.parse(fs.readFileSync(autoImportPath, 'utf-8')).globals || {}
  }
} catch {
  console.warn('无法读取.eslintrc-auto-import.json文件，将使用空对象')
}

// 创建最小配置
export default [
  // 基础配置
  {
    ignores: ['dist', 'src/static', 'node_modules', 'index.html', 'src/unpackage']
  },

  // JS相关配置
  js.configs.recommended,

  ...tseslint.configs.recommended,

  // 自动导入的全局变量及其他全局变量
  {
    languageOptions: {
      globals: {
        ...autoImportGlobals,
        console: 'readonly',
        uni: 'readonly',
        wx: 'readonly'
      }
    },
    rules: {
      // 关闭未使用变量的检查
      'no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }],
      // 禁用重复声明警告，允许函数重载
      'no-redeclare': 'off',
      // 禁用没有定义的ESLint规则(解决env.d.ts中的错误)
      '@typescript-eslint/ban-types': 'off'
    }
  },

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off' // 允许所有文件使用any
    }
  },

  // TypeScript配置
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    rules: {
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          fixToUnknown: true // 关键：允许自动修复为 unknown
        }
      ],
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', varsIgnorePattern: '^_' }]
    }
  },

  // Vue文件配置
  {
    files: ['**/*.vue'],
    plugins: {
      vue: vuePlugin
    },
    languageOptions: {
      parser: vueParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        // 在Vue文件的<script>标签中使用TypeScript解析器
        parser: tseslint.parser
      }
    },
    rules: {
      // Vue格式规则
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'always', component: 'always' }
        }
      ],
      // 放宽部分规则
      'vue/multi-word-component-names': 'off',
      // 自定义规则
      'no-unused-vars': 'off', // 在Vue文件中关闭基础的未使用变量检查
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern:
            '^_|props|emit|refs|ref|setup|onMounted|watch|computed|defineProps|defineEmits|error|useState|useStore|useRoute|useRouter',
          argsIgnorePattern: '^_|e|event|err|error'
        }
      ],
      'vue/attributes-order': 'error'
    }
  },

  // 特定文件规则覆盖 - 禁用enum文件的unused-vars规则
  {
    files: ['**/enum/**/*.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },

  // d.ts类型定义文件规则
  {
    files: ['**/*.d.ts'],
    rules: {
      'no-undef': 'off' // 在类型定义文件中禁用未定义变量检查
    }
  },

  // 允许在特定文件中使用any类型
  {
    files: ['**/api/**/*.ts', '**/hooks/**/*.ts', '**/store/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    // 显式声明插件对象
    plugins: {
      import: eslintPluginImport
    },
    rules: {
      // 启用规则
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'type', // 使用 import type 导入的模块
            'builtin', // Node 内置模块（如 path）
            'external', // 第三方库（如 lodash）
            'internal', // 内部模块，如相对路径的模块、包名前缀为 @ 的模块。
            ['parent', 'sibling'], //[父级目录的模块, 同级目录的模块]
            'index', // 当前目录的 index 文件
            'object' // 使用ES6 导入的模块
          ],
          'newlines-between': 'always', // 分组间空行分隔
          alphabetize: {
            order: 'asc' // 字母升序排列
          },
          // 更明确的路径匹配规则
          pathGroups: [
            {
              pattern: '@/**/!(*.vue)', // 主项目路径
              group: 'internal'
            },
            {
              pattern: '@/**/*.vue',
              group: 'parent',
              position: 'before'
            }
          ],
          pathGroupsExcludedImportTypes: ['type'] // 不重复分类类型导入
        }
      ]
    }
  },
  {
    plugins: {
      'unused-imports': unusedImports
    },
    rules: {
      // 标记未使用的 import
      'unused-imports/no-unused-imports': 'error',
      // 防止重复导入自动导入的内容
      'import/no-duplicates': 'error'
    }
  }
]
