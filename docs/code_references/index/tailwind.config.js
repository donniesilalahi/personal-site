module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primitives-colors-base-black': 'var(--primitives-colors-base-black)',
        'primitives-colors-base-transparent':
          'var(--primitives-colors-base-transparent)',
        'primitives-colors-base-white': 'var(--primitives-colors-base-white)',
        'primitives-colors-blue-100': 'var(--primitives-colors-blue-100)',
        'primitives-colors-blue-200': 'var(--primitives-colors-blue-200)',
        'primitives-colors-blue-25': 'var(--primitives-colors-blue-25)',
        'primitives-colors-blue-300': 'var(--primitives-colors-blue-300)',
        'primitives-colors-blue-400': 'var(--primitives-colors-blue-400)',
        'primitives-colors-blue-50': 'var(--primitives-colors-blue-50)',
        'primitives-colors-blue-500': 'var(--primitives-colors-blue-500)',
        'primitives-colors-blue-600': 'var(--primitives-colors-blue-600)',
        'primitives-colors-blue-700': 'var(--primitives-colors-blue-700)',
        'primitives-colors-blue-800': 'var(--primitives-colors-blue-800)',
        'primitives-colors-blue-900': 'var(--primitives-colors-blue-900)',
        'primitives-colors-blue-950': 'var(--primitives-colors-blue-950)',
        'primitives-colors-blue-dark-100':
          'var(--primitives-colors-blue-dark-100)',
        'primitives-colors-blue-dark-200':
          'var(--primitives-colors-blue-dark-200)',
        'primitives-colors-blue-dark-25':
          'var(--primitives-colors-blue-dark-25)',
        'primitives-colors-blue-dark-300':
          'var(--primitives-colors-blue-dark-300)',
        'primitives-colors-blue-dark-400':
          'var(--primitives-colors-blue-dark-400)',
        'primitives-colors-blue-dark-50':
          'var(--primitives-colors-blue-dark-50)',
        'primitives-colors-blue-dark-500':
          'var(--primitives-colors-blue-dark-500)',
        'primitives-colors-blue-dark-600':
          'var(--primitives-colors-blue-dark-600)',
        'primitives-colors-blue-dark-700':
          'var(--primitives-colors-blue-dark-700)',
        'primitives-colors-blue-dark-800':
          'var(--primitives-colors-blue-dark-800)',
        'primitives-colors-blue-dark-900':
          'var(--primitives-colors-blue-dark-900)',
        'primitives-colors-blue-dark-950':
          'var(--primitives-colors-blue-dark-950)',
        'primitives-colors-blue-light-100':
          'var(--primitives-colors-blue-light-100)',
        'primitives-colors-blue-light-200':
          'var(--primitives-colors-blue-light-200)',
        'primitives-colors-blue-light-25':
          'var(--primitives-colors-blue-light-25)',
        'primitives-colors-blue-light-300':
          'var(--primitives-colors-blue-light-300)',
        'primitives-colors-blue-light-400':
          'var(--primitives-colors-blue-light-400)',
        'primitives-colors-blue-light-50':
          'var(--primitives-colors-blue-light-50)',
        'primitives-colors-blue-light-500':
          'var(--primitives-colors-blue-light-500)',
        'primitives-colors-blue-light-600':
          'var(--primitives-colors-blue-light-600)',
        'primitives-colors-blue-light-700':
          'var(--primitives-colors-blue-light-700)',
        'primitives-colors-blue-light-800':
          'var(--primitives-colors-blue-light-800)',
        'primitives-colors-blue-light-900':
          'var(--primitives-colors-blue-light-900)',
        'primitives-colors-blue-light-950':
          'var(--primitives-colors-blue-light-950)',
        'primitives-colors-cyan-100': 'var(--primitives-colors-cyan-100)',
        'primitives-colors-cyan-200': 'var(--primitives-colors-cyan-200)',
        'primitives-colors-cyan-25': 'var(--primitives-colors-cyan-25)',
        'primitives-colors-cyan-300': 'var(--primitives-colors-cyan-300)',
        'primitives-colors-cyan-400': 'var(--primitives-colors-cyan-400)',
        'primitives-colors-cyan-50': 'var(--primitives-colors-cyan-50)',
        'primitives-colors-cyan-500': 'var(--primitives-colors-cyan-500)',
        'primitives-colors-cyan-600': 'var(--primitives-colors-cyan-600)',
        'primitives-colors-cyan-700': 'var(--primitives-colors-cyan-700)',
        'primitives-colors-cyan-800': 'var(--primitives-colors-cyan-800)',
        'primitives-colors-cyan-900': 'var(--primitives-colors-cyan-900)',
        'primitives-colors-cyan-950': 'var(--primitives-colors-cyan-950)',
        'primitives-colors-error-100': 'var(--primitives-colors-error-100)',
        'primitives-colors-error-200': 'var(--primitives-colors-error-200)',
        'primitives-colors-error-25': 'var(--primitives-colors-error-25)',
        'primitives-colors-error-300': 'var(--primitives-colors-error-300)',
        'primitives-colors-error-400': 'var(--primitives-colors-error-400)',
        'primitives-colors-error-50': 'var(--primitives-colors-error-50)',
        'primitives-colors-error-500': 'var(--primitives-colors-error-500)',
        'primitives-colors-error-600': 'var(--primitives-colors-error-600)',
        'primitives-colors-error-700': 'var(--primitives-colors-error-700)',
        'primitives-colors-error-800': 'var(--primitives-colors-error-800)',
        'primitives-colors-error-900': 'var(--primitives-colors-error-900)',
        'primitives-colors-error-950': 'var(--primitives-colors-error-950)',
        'primitives-colors-fuchsia-100': 'var(--primitives-colors-fuchsia-100)',
        'primitives-colors-fuchsia-200': 'var(--primitives-colors-fuchsia-200)',
        'primitives-colors-fuchsia-25': 'var(--primitives-colors-fuchsia-25)',
        'primitives-colors-fuchsia-300': 'var(--primitives-colors-fuchsia-300)',
        'primitives-colors-fuchsia-400': 'var(--primitives-colors-fuchsia-400)',
        'primitives-colors-fuchsia-50': 'var(--primitives-colors-fuchsia-50)',
        'primitives-colors-fuchsia-500': 'var(--primitives-colors-fuchsia-500)',
        'primitives-colors-fuchsia-600': 'var(--primitives-colors-fuchsia-600)',
        'primitives-colors-fuchsia-700': 'var(--primitives-colors-fuchsia-700)',
        'primitives-colors-fuchsia-800': 'var(--primitives-colors-fuchsia-800)',
        'primitives-colors-fuchsia-900': 'var(--primitives-colors-fuchsia-900)',
        'primitives-colors-fuchsia-950': 'var(--primitives-colors-fuchsia-950)',
        'primitives-colors-gray-blue-100':
          'var(--primitives-colors-gray-blue-100)',
        'primitives-colors-gray-blue-200':
          'var(--primitives-colors-gray-blue-200)',
        'primitives-colors-gray-blue-25':
          'var(--primitives-colors-gray-blue-25)',
        'primitives-colors-gray-blue-300':
          'var(--primitives-colors-gray-blue-300)',
        'primitives-colors-gray-blue-400':
          'var(--primitives-colors-gray-blue-400)',
        'primitives-colors-gray-blue-50':
          'var(--primitives-colors-gray-blue-50)',
        'primitives-colors-gray-blue-500':
          'var(--primitives-colors-gray-blue-500)',
        'primitives-colors-gray-blue-600':
          'var(--primitives-colors-gray-blue-600)',
        'primitives-colors-gray-blue-700':
          'var(--primitives-colors-gray-blue-700)',
        'primitives-colors-gray-blue-800':
          'var(--primitives-colors-gray-blue-800)',
        'primitives-colors-gray-blue-900':
          'var(--primitives-colors-gray-blue-900)',
        'primitives-colors-gray-blue-950':
          'var(--primitives-colors-gray-blue-950)',
        'primitives-colors-gray-cool-100':
          'var(--primitives-colors-gray-cool-100)',
        'primitives-colors-gray-cool-200':
          'var(--primitives-colors-gray-cool-200)',
        'primitives-colors-gray-cool-25':
          'var(--primitives-colors-gray-cool-25)',
        'primitives-colors-gray-cool-300':
          'var(--primitives-colors-gray-cool-300)',
        'primitives-colors-gray-cool-400':
          'var(--primitives-colors-gray-cool-400)',
        'primitives-colors-gray-cool-50':
          'var(--primitives-colors-gray-cool-50)',
        'primitives-colors-gray-cool-500':
          'var(--primitives-colors-gray-cool-500)',
        'primitives-colors-gray-cool-600':
          'var(--primitives-colors-gray-cool-600)',
        'primitives-colors-gray-cool-700':
          'var(--primitives-colors-gray-cool-700)',
        'primitives-colors-gray-cool-800':
          'var(--primitives-colors-gray-cool-800)',
        'primitives-colors-gray-cool-900':
          'var(--primitives-colors-gray-cool-900)',
        'primitives-colors-gray-cool-950':
          'var(--primitives-colors-gray-cool-950)',
        'primitives-colors-gray-dark-mode-100':
          'var(--primitives-colors-gray-dark-mode-100)',
        'primitives-colors-gray-dark-mode-200':
          'var(--primitives-colors-gray-dark-mode-200)',
        'primitives-colors-gray-dark-mode-25':
          'var(--primitives-colors-gray-dark-mode-25)',
        'primitives-colors-gray-dark-mode-300':
          'var(--primitives-colors-gray-dark-mode-300)',
        'primitives-colors-gray-dark-mode-400':
          'var(--primitives-colors-gray-dark-mode-400)',
        'primitives-colors-gray-dark-mode-50':
          'var(--primitives-colors-gray-dark-mode-50)',
        'primitives-colors-gray-dark-mode-500':
          'var(--primitives-colors-gray-dark-mode-500)',
        'primitives-colors-gray-dark-mode-600':
          'var(--primitives-colors-gray-dark-mode-600)',
        'primitives-colors-gray-dark-mode-700':
          'var(--primitives-colors-gray-dark-mode-700)',
        'primitives-colors-gray-dark-mode-800':
          'var(--primitives-colors-gray-dark-mode-800)',
        'primitives-colors-gray-dark-mode-900':
          'var(--primitives-colors-gray-dark-mode-900)',
        'primitives-colors-gray-dark-mode-950':
          'var(--primitives-colors-gray-dark-mode-950)',
        'primitives-colors-gray-dark-mode-alpha-100':
          'var(--primitives-colors-gray-dark-mode-alpha-100)',
        'primitives-colors-gray-dark-mode-alpha-200':
          'var(--primitives-colors-gray-dark-mode-alpha-200)',
        'primitives-colors-gray-dark-mode-alpha-25':
          'var(--primitives-colors-gray-dark-mode-alpha-25)',
        'primitives-colors-gray-dark-mode-alpha-300':
          'var(--primitives-colors-gray-dark-mode-alpha-300)',
        'primitives-colors-gray-dark-mode-alpha-400':
          'var(--primitives-colors-gray-dark-mode-alpha-400)',
        'primitives-colors-gray-dark-mode-alpha-50':
          'var(--primitives-colors-gray-dark-mode-alpha-50)',
        'primitives-colors-gray-dark-mode-alpha-500':
          'var(--primitives-colors-gray-dark-mode-alpha-500)',
        'primitives-colors-gray-dark-mode-alpha-600':
          'var(--primitives-colors-gray-dark-mode-alpha-600)',
        'primitives-colors-gray-dark-mode-alpha-700':
          'var(--primitives-colors-gray-dark-mode-alpha-700)',
        'primitives-colors-gray-dark-mode-alpha-800':
          'var(--primitives-colors-gray-dark-mode-alpha-800)',
        'primitives-colors-gray-dark-mode-alpha-900':
          'var(--primitives-colors-gray-dark-mode-alpha-900)',
        'primitives-colors-gray-dark-mode-alpha-950':
          'var(--primitives-colors-gray-dark-mode-alpha-950)',
        'primitives-colors-gray-iron-100':
          'var(--primitives-colors-gray-iron-100)',
        'primitives-colors-gray-iron-200':
          'var(--primitives-colors-gray-iron-200)',
        'primitives-colors-gray-iron-25':
          'var(--primitives-colors-gray-iron-25)',
        'primitives-colors-gray-iron-300':
          'var(--primitives-colors-gray-iron-300)',
        'primitives-colors-gray-iron-400':
          'var(--primitives-colors-gray-iron-400)',
        'primitives-colors-gray-iron-50':
          'var(--primitives-colors-gray-iron-50)',
        'primitives-colors-gray-iron-500':
          'var(--primitives-colors-gray-iron-500)',
        'primitives-colors-gray-iron-600':
          'var(--primitives-colors-gray-iron-600)',
        'primitives-colors-gray-iron-700':
          'var(--primitives-colors-gray-iron-700)',
        'primitives-colors-gray-iron-800':
          'var(--primitives-colors-gray-iron-800)',
        'primitives-colors-gray-iron-900':
          'var(--primitives-colors-gray-iron-900)',
        'primitives-colors-gray-iron-950':
          'var(--primitives-colors-gray-iron-950)',
        'primitives-colors-gray-light-mode-100':
          'var(--primitives-colors-gray-light-mode-100)',
        'primitives-colors-gray-light-mode-200':
          'var(--primitives-colors-gray-light-mode-200)',
        'primitives-colors-gray-light-mode-25':
          'var(--primitives-colors-gray-light-mode-25)',
        'primitives-colors-gray-light-mode-300':
          'var(--primitives-colors-gray-light-mode-300)',
        'primitives-colors-gray-light-mode-400':
          'var(--primitives-colors-gray-light-mode-400)',
        'primitives-colors-gray-light-mode-50':
          'var(--primitives-colors-gray-light-mode-50)',
        'primitives-colors-gray-light-mode-500':
          'var(--primitives-colors-gray-light-mode-500)',
        'primitives-colors-gray-light-mode-600':
          'var(--primitives-colors-gray-light-mode-600)',
        'primitives-colors-gray-light-mode-700':
          'var(--primitives-colors-gray-light-mode-700)',
        'primitives-colors-gray-light-mode-800':
          'var(--primitives-colors-gray-light-mode-800)',
        'primitives-colors-gray-light-mode-900':
          'var(--primitives-colors-gray-light-mode-900)',
        'primitives-colors-gray-light-mode-950':
          'var(--primitives-colors-gray-light-mode-950)',
        'primitives-colors-gray-modern-100':
          'var(--primitives-colors-gray-modern-100)',
        'primitives-colors-gray-modern-200':
          'var(--primitives-colors-gray-modern-200)',
        'primitives-colors-gray-modern-25':
          'var(--primitives-colors-gray-modern-25)',
        'primitives-colors-gray-modern-300':
          'var(--primitives-colors-gray-modern-300)',
        'primitives-colors-gray-modern-400':
          'var(--primitives-colors-gray-modern-400)',
        'primitives-colors-gray-modern-50':
          'var(--primitives-colors-gray-modern-50)',
        'primitives-colors-gray-modern-500':
          'var(--primitives-colors-gray-modern-500)',
        'primitives-colors-gray-modern-600':
          'var(--primitives-colors-gray-modern-600)',
        'primitives-colors-gray-modern-700':
          'var(--primitives-colors-gray-modern-700)',
        'primitives-colors-gray-modern-800':
          'var(--primitives-colors-gray-modern-800)',
        'primitives-colors-gray-modern-900':
          'var(--primitives-colors-gray-modern-900)',
        'primitives-colors-gray-modern-950':
          'var(--primitives-colors-gray-modern-950)',
        'primitives-colors-gray-neutral-100':
          'var(--primitives-colors-gray-neutral-100)',
        'primitives-colors-gray-neutral-200':
          'var(--primitives-colors-gray-neutral-200)',
        'primitives-colors-gray-neutral-25':
          'var(--primitives-colors-gray-neutral-25)',
        'primitives-colors-gray-neutral-300':
          'var(--primitives-colors-gray-neutral-300)',
        'primitives-colors-gray-neutral-400':
          'var(--primitives-colors-gray-neutral-400)',
        'primitives-colors-gray-neutral-50':
          'var(--primitives-colors-gray-neutral-50)',
        'primitives-colors-gray-neutral-500':
          'var(--primitives-colors-gray-neutral-500)',
        'primitives-colors-gray-neutral-600':
          'var(--primitives-colors-gray-neutral-600)',
        'primitives-colors-gray-neutral-700':
          'var(--primitives-colors-gray-neutral-700)',
        'primitives-colors-gray-neutral-800':
          'var(--primitives-colors-gray-neutral-800)',
        'primitives-colors-gray-neutral-900':
          'var(--primitives-colors-gray-neutral-900)',
        'primitives-colors-gray-neutral-950':
          'var(--primitives-colors-gray-neutral-950)',
        'primitives-colors-gray-true-100':
          'var(--primitives-colors-gray-true-100)',
        'primitives-colors-gray-true-200':
          'var(--primitives-colors-gray-true-200)',
        'primitives-colors-gray-true-25':
          'var(--primitives-colors-gray-true-25)',
        'primitives-colors-gray-true-300':
          'var(--primitives-colors-gray-true-300)',
        'primitives-colors-gray-true-400':
          'var(--primitives-colors-gray-true-400)',
        'primitives-colors-gray-true-50':
          'var(--primitives-colors-gray-true-50)',
        'primitives-colors-gray-true-500':
          'var(--primitives-colors-gray-true-500)',
        'primitives-colors-gray-true-600':
          'var(--primitives-colors-gray-true-600)',
        'primitives-colors-gray-true-700':
          'var(--primitives-colors-gray-true-700)',
        'primitives-colors-gray-true-800':
          'var(--primitives-colors-gray-true-800)',
        'primitives-colors-gray-true-900':
          'var(--primitives-colors-gray-true-900)',
        'primitives-colors-gray-true-950':
          'var(--primitives-colors-gray-true-950)',
        'primitives-colors-gray-warm-100':
          'var(--primitives-colors-gray-warm-100)',
        'primitives-colors-gray-warm-200':
          'var(--primitives-colors-gray-warm-200)',
        'primitives-colors-gray-warm-25':
          'var(--primitives-colors-gray-warm-25)',
        'primitives-colors-gray-warm-300':
          'var(--primitives-colors-gray-warm-300)',
        'primitives-colors-gray-warm-400':
          'var(--primitives-colors-gray-warm-400)',
        'primitives-colors-gray-warm-50':
          'var(--primitives-colors-gray-warm-50)',
        'primitives-colors-gray-warm-500':
          'var(--primitives-colors-gray-warm-500)',
        'primitives-colors-gray-warm-600':
          'var(--primitives-colors-gray-warm-600)',
        'primitives-colors-gray-warm-700':
          'var(--primitives-colors-gray-warm-700)',
        'primitives-colors-gray-warm-800':
          'var(--primitives-colors-gray-warm-800)',
        'primitives-colors-gray-warm-900':
          'var(--primitives-colors-gray-warm-900)',
        'primitives-colors-gray-warm-950':
          'var(--primitives-colors-gray-warm-950)',
        'primitives-colors-green-100': 'var(--primitives-colors-green-100)',
        'primitives-colors-green-200': 'var(--primitives-colors-green-200)',
        'primitives-colors-green-25': 'var(--primitives-colors-green-25)',
        'primitives-colors-green-300': 'var(--primitives-colors-green-300)',
        'primitives-colors-green-400': 'var(--primitives-colors-green-400)',
        'primitives-colors-green-50': 'var(--primitives-colors-green-50)',
        'primitives-colors-green-500': 'var(--primitives-colors-green-500)',
        'primitives-colors-green-600': 'var(--primitives-colors-green-600)',
        'primitives-colors-green-700': 'var(--primitives-colors-green-700)',
        'primitives-colors-green-800': 'var(--primitives-colors-green-800)',
        'primitives-colors-green-900': 'var(--primitives-colors-green-900)',
        'primitives-colors-green-950': 'var(--primitives-colors-green-950)',
        'primitives-colors-green-light-100':
          'var(--primitives-colors-green-light-100)',
        'primitives-colors-green-light-200':
          'var(--primitives-colors-green-light-200)',
        'primitives-colors-green-light-25':
          'var(--primitives-colors-green-light-25)',
        'primitives-colors-green-light-300':
          'var(--primitives-colors-green-light-300)',
        'primitives-colors-green-light-400':
          'var(--primitives-colors-green-light-400)',
        'primitives-colors-green-light-50':
          'var(--primitives-colors-green-light-50)',
        'primitives-colors-green-light-500':
          'var(--primitives-colors-green-light-500)',
        'primitives-colors-green-light-600':
          'var(--primitives-colors-green-light-600)',
        'primitives-colors-green-light-700':
          'var(--primitives-colors-green-light-700)',
        'primitives-colors-green-light-800':
          'var(--primitives-colors-green-light-800)',
        'primitives-colors-green-light-900':
          'var(--primitives-colors-green-light-900)',
        'primitives-colors-green-light-950':
          'var(--primitives-colors-green-light-950)',
        'primitives-colors-indigo-100': 'var(--primitives-colors-indigo-100)',
        'primitives-colors-indigo-200': 'var(--primitives-colors-indigo-200)',
        'primitives-colors-indigo-25': 'var(--primitives-colors-indigo-25)',
        'primitives-colors-indigo-300': 'var(--primitives-colors-indigo-300)',
        'primitives-colors-indigo-400': 'var(--primitives-colors-indigo-400)',
        'primitives-colors-indigo-50': 'var(--primitives-colors-indigo-50)',
        'primitives-colors-indigo-500': 'var(--primitives-colors-indigo-500)',
        'primitives-colors-indigo-600': 'var(--primitives-colors-indigo-600)',
        'primitives-colors-indigo-700': 'var(--primitives-colors-indigo-700)',
        'primitives-colors-indigo-800': 'var(--primitives-colors-indigo-800)',
        'primitives-colors-indigo-900': 'var(--primitives-colors-indigo-900)',
        'primitives-colors-indigo-950': 'var(--primitives-colors-indigo-950)',
        'primitives-colors-jakarta-deep-100':
          'var(--primitives-colors-jakarta-deep-100)',
        'primitives-colors-jakarta-deep-200':
          'var(--primitives-colors-jakarta-deep-200)',
        'primitives-colors-jakarta-deep-25':
          'var(--primitives-colors-jakarta-deep-25)',
        'primitives-colors-jakarta-deep-300':
          'var(--primitives-colors-jakarta-deep-300)',
        'primitives-colors-jakarta-deep-400':
          'var(--primitives-colors-jakarta-deep-400)',
        'primitives-colors-jakarta-deep-50':
          'var(--primitives-colors-jakarta-deep-50)',
        'primitives-colors-jakarta-deep-500':
          'var(--primitives-colors-jakarta-deep-500)',
        'primitives-colors-jakarta-deep-600':
          'var(--primitives-colors-jakarta-deep-600)',
        'primitives-colors-jakarta-deep-700':
          'var(--primitives-colors-jakarta-deep-700)',
        'primitives-colors-jakarta-deep-800':
          'var(--primitives-colors-jakarta-deep-800)',
        'primitives-colors-jakarta-deep-900':
          'var(--primitives-colors-jakarta-deep-900)',
        'primitives-colors-jakarta-deep-950':
          'var(--primitives-colors-jakarta-deep-950)',
        'primitives-colors-jakarta-speed-100':
          'var(--primitives-colors-jakarta-speed-100)',
        'primitives-colors-jakarta-speed-200':
          'var(--primitives-colors-jakarta-speed-200)',
        'primitives-colors-jakarta-speed-25':
          'var(--primitives-colors-jakarta-speed-25)',
        'primitives-colors-jakarta-speed-300':
          'var(--primitives-colors-jakarta-speed-300)',
        'primitives-colors-jakarta-speed-400':
          'var(--primitives-colors-jakarta-speed-400)',
        'primitives-colors-jakarta-speed-50':
          'var(--primitives-colors-jakarta-speed-50)',
        'primitives-colors-jakarta-speed-500':
          'var(--primitives-colors-jakarta-speed-500)',
        'primitives-colors-jakarta-speed-600':
          'var(--primitives-colors-jakarta-speed-600)',
        'primitives-colors-jakarta-speed-700':
          'var(--primitives-colors-jakarta-speed-700)',
        'primitives-colors-jakarta-speed-800':
          'var(--primitives-colors-jakarta-speed-800)',
        'primitives-colors-jakarta-speed-900':
          'var(--primitives-colors-jakarta-speed-900)',
        'primitives-colors-jakarta-speed-950':
          'var(--primitives-colors-jakarta-speed-950)',
        'primitives-colors-moss-100': 'var(--primitives-colors-moss-100)',
        'primitives-colors-moss-200': 'var(--primitives-colors-moss-200)',
        'primitives-colors-moss-25': 'var(--primitives-colors-moss-25)',
        'primitives-colors-moss-300': 'var(--primitives-colors-moss-300)',
        'primitives-colors-moss-400': 'var(--primitives-colors-moss-400)',
        'primitives-colors-moss-50': 'var(--primitives-colors-moss-50)',
        'primitives-colors-moss-500': 'var(--primitives-colors-moss-500)',
        'primitives-colors-moss-600': 'var(--primitives-colors-moss-600)',
        'primitives-colors-moss-700': 'var(--primitives-colors-moss-700)',
        'primitives-colors-moss-800': 'var(--primitives-colors-moss-800)',
        'primitives-colors-moss-900': 'var(--primitives-colors-moss-900)',
        'primitives-colors-moss-950': 'var(--primitives-colors-moss-950)',
        'primitives-colors-orange-100': 'var(--primitives-colors-orange-100)',
        'primitives-colors-orange-200': 'var(--primitives-colors-orange-200)',
        'primitives-colors-orange-25': 'var(--primitives-colors-orange-25)',
        'primitives-colors-orange-300': 'var(--primitives-colors-orange-300)',
        'primitives-colors-orange-400': 'var(--primitives-colors-orange-400)',
        'primitives-colors-orange-50': 'var(--primitives-colors-orange-50)',
        'primitives-colors-orange-500': 'var(--primitives-colors-orange-500)',
        'primitives-colors-orange-600': 'var(--primitives-colors-orange-600)',
        'primitives-colors-orange-700': 'var(--primitives-colors-orange-700)',
        'primitives-colors-orange-800': 'var(--primitives-colors-orange-800)',
        'primitives-colors-orange-900': 'var(--primitives-colors-orange-900)',
        'primitives-colors-orange-950': 'var(--primitives-colors-orange-950)',
        'primitives-colors-orange-dark-100':
          'var(--primitives-colors-orange-dark-100)',
        'primitives-colors-orange-dark-200':
          'var(--primitives-colors-orange-dark-200)',
        'primitives-colors-orange-dark-25':
          'var(--primitives-colors-orange-dark-25)',
        'primitives-colors-orange-dark-300':
          'var(--primitives-colors-orange-dark-300)',
        'primitives-colors-orange-dark-400':
          'var(--primitives-colors-orange-dark-400)',
        'primitives-colors-orange-dark-50':
          'var(--primitives-colors-orange-dark-50)',
        'primitives-colors-orange-dark-500':
          'var(--primitives-colors-orange-dark-500)',
        'primitives-colors-orange-dark-600':
          'var(--primitives-colors-orange-dark-600)',
        'primitives-colors-orange-dark-700':
          'var(--primitives-colors-orange-dark-700)',
        'primitives-colors-orange-dark-800':
          'var(--primitives-colors-orange-dark-800)',
        'primitives-colors-orange-dark-900':
          'var(--primitives-colors-orange-dark-900)',
        'primitives-colors-orange-dark-950':
          'var(--primitives-colors-orange-dark-950)',
        'primitives-colors-pink-100': 'var(--primitives-colors-pink-100)',
        'primitives-colors-pink-200': 'var(--primitives-colors-pink-200)',
        'primitives-colors-pink-25': 'var(--primitives-colors-pink-25)',
        'primitives-colors-pink-300': 'var(--primitives-colors-pink-300)',
        'primitives-colors-pink-400': 'var(--primitives-colors-pink-400)',
        'primitives-colors-pink-50': 'var(--primitives-colors-pink-50)',
        'primitives-colors-pink-500': 'var(--primitives-colors-pink-500)',
        'primitives-colors-pink-600': 'var(--primitives-colors-pink-600)',
        'primitives-colors-pink-700': 'var(--primitives-colors-pink-700)',
        'primitives-colors-pink-800': 'var(--primitives-colors-pink-800)',
        'primitives-colors-pink-900': 'var(--primitives-colors-pink-900)',
        'primitives-colors-pink-950': 'var(--primitives-colors-pink-950)',
        'primitives-colors-purple-100': 'var(--primitives-colors-purple-100)',
        'primitives-colors-purple-200': 'var(--primitives-colors-purple-200)',
        'primitives-colors-purple-25': 'var(--primitives-colors-purple-25)',
        'primitives-colors-purple-300': 'var(--primitives-colors-purple-300)',
        'primitives-colors-purple-400': 'var(--primitives-colors-purple-400)',
        'primitives-colors-purple-50': 'var(--primitives-colors-purple-50)',
        'primitives-colors-purple-500': 'var(--primitives-colors-purple-500)',
        'primitives-colors-purple-600': 'var(--primitives-colors-purple-600)',
        'primitives-colors-purple-700': 'var(--primitives-colors-purple-700)',
        'primitives-colors-purple-800': 'var(--primitives-colors-purple-800)',
        'primitives-colors-purple-900': 'var(--primitives-colors-purple-900)',
        'primitives-colors-purple-950': 'var(--primitives-colors-purple-950)',
        'primitives-colors-ros-100': 'var(--primitives-colors-ros-100)',
        'primitives-colors-ros-200': 'var(--primitives-colors-ros-200)',
        'primitives-colors-ros-25': 'var(--primitives-colors-ros-25)',
        'primitives-colors-ros-300': 'var(--primitives-colors-ros-300)',
        'primitives-colors-ros-400': 'var(--primitives-colors-ros-400)',
        'primitives-colors-ros-50': 'var(--primitives-colors-ros-50)',
        'primitives-colors-ros-500': 'var(--primitives-colors-ros-500)',
        'primitives-colors-ros-600': 'var(--primitives-colors-ros-600)',
        'primitives-colors-ros-700': 'var(--primitives-colors-ros-700)',
        'primitives-colors-ros-800': 'var(--primitives-colors-ros-800)',
        'primitives-colors-ros-900': 'var(--primitives-colors-ros-900)',
        'primitives-colors-ros-950': 'var(--primitives-colors-ros-950)',
        'primitives-colors-success-100': 'var(--primitives-colors-success-100)',
        'primitives-colors-success-200': 'var(--primitives-colors-success-200)',
        'primitives-colors-success-25': 'var(--primitives-colors-success-25)',
        'primitives-colors-success-300': 'var(--primitives-colors-success-300)',
        'primitives-colors-success-400': 'var(--primitives-colors-success-400)',
        'primitives-colors-success-50': 'var(--primitives-colors-success-50)',
        'primitives-colors-success-500': 'var(--primitives-colors-success-500)',
        'primitives-colors-success-600': 'var(--primitives-colors-success-600)',
        'primitives-colors-success-700': 'var(--primitives-colors-success-700)',
        'primitives-colors-success-800': 'var(--primitives-colors-success-800)',
        'primitives-colors-success-900': 'var(--primitives-colors-success-900)',
        'primitives-colors-success-950': 'var(--primitives-colors-success-950)',
        'primitives-colors-teal-100': 'var(--primitives-colors-teal-100)',
        'primitives-colors-teal-200': 'var(--primitives-colors-teal-200)',
        'primitives-colors-teal-25': 'var(--primitives-colors-teal-25)',
        'primitives-colors-teal-300': 'var(--primitives-colors-teal-300)',
        'primitives-colors-teal-400': 'var(--primitives-colors-teal-400)',
        'primitives-colors-teal-50': 'var(--primitives-colors-teal-50)',
        'primitives-colors-teal-500': 'var(--primitives-colors-teal-500)',
        'primitives-colors-teal-600': 'var(--primitives-colors-teal-600)',
        'primitives-colors-teal-700': 'var(--primitives-colors-teal-700)',
        'primitives-colors-teal-800': 'var(--primitives-colors-teal-800)',
        'primitives-colors-teal-900': 'var(--primitives-colors-teal-900)',
        'primitives-colors-teal-950': 'var(--primitives-colors-teal-950)',
        'primitives-colors-violet-100': 'var(--primitives-colors-violet-100)',
        'primitives-colors-violet-200': 'var(--primitives-colors-violet-200)',
        'primitives-colors-violet-25': 'var(--primitives-colors-violet-25)',
        'primitives-colors-violet-300': 'var(--primitives-colors-violet-300)',
        'primitives-colors-violet-400': 'var(--primitives-colors-violet-400)',
        'primitives-colors-violet-50': 'var(--primitives-colors-violet-50)',
        'primitives-colors-violet-500': 'var(--primitives-colors-violet-500)',
        'primitives-colors-violet-600': 'var(--primitives-colors-violet-600)',
        'primitives-colors-violet-700': 'var(--primitives-colors-violet-700)',
        'primitives-colors-violet-800': 'var(--primitives-colors-violet-800)',
        'primitives-colors-violet-900': 'var(--primitives-colors-violet-900)',
        'primitives-colors-violet-950': 'var(--primitives-colors-violet-950)',
        'primitives-colors-warning-100': 'var(--primitives-colors-warning-100)',
        'primitives-colors-warning-200': 'var(--primitives-colors-warning-200)',
        'primitives-colors-warning-25': 'var(--primitives-colors-warning-25)',
        'primitives-colors-warning-300': 'var(--primitives-colors-warning-300)',
        'primitives-colors-warning-400': 'var(--primitives-colors-warning-400)',
        'primitives-colors-warning-50': 'var(--primitives-colors-warning-50)',
        'primitives-colors-warning-500': 'var(--primitives-colors-warning-500)',
        'primitives-colors-warning-600': 'var(--primitives-colors-warning-600)',
        'primitives-colors-warning-700': 'var(--primitives-colors-warning-700)',
        'primitives-colors-warning-800': 'var(--primitives-colors-warning-800)',
        'primitives-colors-warning-900': 'var(--primitives-colors-warning-900)',
        'primitives-colors-warning-950': 'var(--primitives-colors-warning-950)',
        'primitives-colors-yellow-100': 'var(--primitives-colors-yellow-100)',
        'primitives-colors-yellow-200': 'var(--primitives-colors-yellow-200)',
        'primitives-colors-yellow-25': 'var(--primitives-colors-yellow-25)',
        'primitives-colors-yellow-300': 'var(--primitives-colors-yellow-300)',
        'primitives-colors-yellow-400': 'var(--primitives-colors-yellow-400)',
        'primitives-colors-yellow-50': 'var(--primitives-colors-yellow-50)',
        'primitives-colors-yellow-500': 'var(--primitives-colors-yellow-500)',
        'primitives-colors-yellow-600': 'var(--primitives-colors-yellow-600)',
        'primitives-colors-yellow-700': 'var(--primitives-colors-yellow-700)',
        'primitives-colors-yellow-800': 'var(--primitives-colors-yellow-800)',
        'primitives-colors-yellow-900': 'var(--primitives-colors-yellow-900)',
        'primitives-colors-yellow-950': 'var(--primitives-colors-yellow-950)',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      boxShadow: { 'shadows-stack-ring-xs': 'var(--shadows-stack-ring-xs)' },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
  },
  plugins: [],
  darkMode: ['class'],
}
