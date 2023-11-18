import { cloneVNode, computed, defineComponent, h, PropType } from 'vue'
import { Strategy } from '#ui/types'
import { mergeConfig, getSlotsChildren } from '../../utils'
import { card, cardGroup } from '#ui/ui.config'
import { twMerge, twJoin } from 'tailwind-merge'
// @ts-expect-error
import appConfig from '#build/app.config'

const cardGroupConfig = mergeConfig<typeof cardGroup>(appConfig.ui.strategy, appConfig.ui.cardGroup, cardGroup)

export default defineComponent({
  inheritAttrs: false,
  props: {
    as: {
      type: String,
      default: 'div'
    },
    orientation: {
      type: String as PropType<'horizontal' | 'vertical'>,
      default: 'vertical',
      validator (value: string) {
        return ['horizontal', 'vertical'].includes(value)
      }
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: undefined
    },
    ui: {
      type: Object as PropType<Partial<typeof cardGroupConfig & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup(props, { slots }) {
    const { ui, attrs } = useUI('cardGroup', toRef(props, 'ui'), cardGroupConfig)

    const children = computed(() => getSlotsChildren(slots))

    const rounded = computed(() => {
      const roundedMap = {
        'rounded-none': { horizontal: { left: 'rounded-s-none', right: 'rounded-e-none' }, vertical: { top: 'rounded-t-none', bottom: 'rounded-b-none' } },
        'rounded-sm': { horizontal: { left: 'rounded-s-sm', right: 'rounded-e-sm' }, vertical: { top: 'rounded-t-sm', bottom: 'rounded-b-sm' } },
        rounded: { horizontal: { left: 'rounded-s', right: 'rounded-e' }, vertical: { top: 'rounded-t', bottom: 'rounded-b' } },
        'rounded-md': { horizontal: { left: 'rounded-s-md', right: 'rounded-e-md' }, vertical: { top: 'rounded-t-md', bottom: 'rounded-b-md' } },
        'rounded-lg': { horizontal: { left: 'rounded-s-lg', right: 'rounded-e-lg' }, vertical: { top: 'rounded-t-lg', bottom: 'rounded-b-lg' } },
        'rounded-xl': { horizontal: { left: 'rounded-s-xl', right: 'rounded-e-xl' }, vertical: { top: 'rounded-t-xl', bottom: 'rounded-b-xl' } },
        'rounded-2xl': { horizontal: { left: 'rounded-s-2xl', right: 'rounded-e-2xl' }, vertical: { top: 'rounded-t-2xl', bottom: 'rounded-b-2xl' } },
        'rounded-3xl': { horizontal: { left: 'rounded-s-3xl', right: 'rounded-e-3xl' }, vertical: { top: 'rounded-t-3xl', bottom: 'rounded-b-3xl' } },
        'rounded-full': { horizontal: { left: 'rounded-s-full', right: 'rounded-e-full' }, vertical: { top: 'rounded-t-full', bottom: 'rounded-b-full' } }
      }
      return roundedMap[ui.value.rounded][props.orientation]
    })

    const clones = computed(() => children.value.map((node, index) => {
      const vProps: any = {}

      vProps.ui = node.props?.ui || {}
      vProps.ui.rounded = 'rounded-none'
      vProps.ui.base = '!shadow-none'

      if (index === 0) {
        vProps.ui.rounded += ` ${rounded.value.left || rounded.value.top}`
      }

      if (index === children.value.length - 1) {
        vProps.ui.rounded += ` ${rounded.value.right || rounded.value.bottom}`
      }

      return cloneVNode(node, vProps)
    }))

    const wrapperClass = computed(() => {
      return twMerge(twJoin(
        ui.value.base,
        ui.value.background,
        ui.value.ring,
        ui.value.rounded,
        ui.value.shadow,
        ui.value.orientation[props.orientation]
      ), props.class)
    })

    return () => h(props.as, { class: wrapperClass.value, ...attrs.value }, clones.value)
  }
})
