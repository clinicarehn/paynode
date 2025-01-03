import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'

/**
 * @typedef {import('./nova').default} NovaApp
 */

/**
 * @param {NovaApp} app
 * @param {string} type
 * @param {{[key: string]: any}} requireComponent
 */
function registerComponents(app, type, requireComponent) {
  requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName)
    const componentName = upperFirst(
      camelCase(
        fileName
          .split('/')
          .pop()
          .replace(/\.\w+$/, '')
      )
    )

    app.component(
      type + componentName,
      componentConfig.default || componentConfig
    )
  })
}

/**
 * @param {NovaApp} app
 */
export function registerFields(app) {
  registerComponents(
    app,
    'Index',
    require.context(`./fields/Index`, true, /[A-Z]\w+\.(vue)$/)
  )
  registerComponents(
    app,
    'Detail',
    require.context(`./fields/Detail`, true, /[A-Z]\w+\.(vue)$/)
  )
  registerComponents(
    app,
    'Form',
    require.context(`./fields/Form`, true, /[A-Z]\w+\.(vue)$/)
  )
  registerComponents(
    app,
    'Filter',
    require.context(`./fields/Filter`, true, /[A-Z]\w+\.(vue)$/)
  )
  registerComponents(
    app,
    'Preview',
    require.context(`./fields/Preview`, true, /[A-Z]\w+\.(vue)$/)
  )
}
