// const componentsFiles = require.context('./components', true, /index\.js$/)
// const components = componentsFiles
//   .keys()
//   .reduce((components, componentPath) => {
//     const value = componentsFiles(componentPath)
//     // console.log('path', componentPath)
//     // console.log('value', value)
//     components.push(value)

//     return components
//   }, [])

// console.log('====', components[0].default.name)

// const Element = {}
// Element.install = Vue => {
//   components.forEach(component => {
//     console.log(component.name)
//   })
// }

import Message from './components/message'

const components = []

const Element = {}

Element.install = Vue => {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  Vue.prototype.$message = Message
}

export default Element

export {}
