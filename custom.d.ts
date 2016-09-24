declare module 'react-router-relay'
declare module 'react-datepicker'
declare module 'lokka'
declare module 'drumstick'
declare module 'lokka-transport-http'
declare module 'react-router'
declare module 'react-redux'
declare module 'react-tether'
declare module 'react-helmet'
declare module 'smooch'
declare module 'graphql'
declare module 'graphql/*'
declare module 'graphiql'
declare module 'map-props'
declare module 'react-twitter-widgets'
declare module 'redux-thunk'
declare module 'redux'
declare module 'react-copy-to-clipboard'
declare module 'react-click-outside'
declare module 'react-autocomplete'
declare module 'react-datetime'
declare module 'calculate-size'
declare module 'rc-tooltip'
declare module 'react-tagsinput'
declare module 'graphiql/dist/components/QueryEditor'
declare module 'react-notification-system'
declare module 'react-toggle-button'
declare module 'react-virtualized'
declare module 'cuid'

// declare var fetch: any
declare var analytics: any
declare var __BACKEND_ADDR__: any
declare var __SMOOCH_TOKEN__: any
declare var __ENABLE_SEGMENT__: any
declare var __SEGMENT_TOKEN__: any

declare interface Window {
  analytics: any
}

declare module 'react-relay' {

  // fragments are a hash of functions
  interface Fragments {
    [query: string]: ((variables?: RelayVariables) => string)
  }

  interface CreateContainerOpts {
    initialVariables?: Object
    fragments: Fragments
    prepareVariables?(prevVariables: RelayVariables): RelayVariables
  }

  interface RelayVariables {
    [name: string]: any
  }

  // add static getFragment method to the component constructor
  interface RelayContainerClass<T> extends React.ComponentClass<T> {
    getFragment: ((q: string, vars?: RelayVariables) => string)
  }

  interface RelayQueryRequestResolve {
    response: any
  }

  interface RelayMutationRequest {
    getQueryString(): string
    getVariables(): RelayVariables
    resolve(result: RelayQueryRequestResolve)
    reject(errors: any)
  }

  interface RelayQueryRequest {
    resolve(result: RelayQueryRequestResolve)
    reject(errors: any)

    getQueryString(): string
    getVariables(): RelayVariables
    getID(): string
    getDebugName(): string
  }

  interface RelayNetworkLayer {
    supports(...options: string[]): boolean
  }

  class DefaultNetworkLayer implements RelayNetworkLayer {
    constructor(host: string, options: any)
    supports(...options: string[]): boolean
  }
  interface RelayQuery {
    query: string
  }
  function createContainer<T>(component: React.ComponentClass<T>, params?: CreateContainerOpts): RelayContainerClass<any>
  function injectNetworkLayer(networkLayer: RelayNetworkLayer)
  function isContainer(component: React.ComponentClass<any>): boolean
  function QL(...args: any[]): string
  function createQuery(query: string, variables: RelayVariables)

  class Route {
    constructor(params?: RelayVariables)
  }

  // Relay Mutation class, where T are the props it takes and S is the returned payload from Relay.Store.update.
  // S is typically dynamic as it depends on the data the app is currently using, but it's possible to always
  // return some data in the payload using REQUIRED_CHILDREN which is where specifying S is the most useful.
  class Mutation<T,S> {
    props: T

    constructor(props: T)
    static getFragment(q: string): string
  }

  interface Transaction {
    getError(): Error
    Status(): number
  }

  interface StoreUpdateCallbacks<T> {
    onFailure?(transaction: Transaction)
    onSuccess?(response: T)
  }

  interface Store {
    commitUpdate(mutation: Mutation<any,any>, callbacks?: StoreUpdateCallbacks<any>)
    primeCache(query: RelayQuery, callback: (done: any, error: any)=>void)
    readQuery(query: string)
  }

  var Store: Store

  class RootContainer extends React.Component<RootContainerProps,any> {}

  interface RootContainerProps extends React.Props<RootContainer>{
    Component: RelayContainerClass<any>
    route: Route
    renderLoading?(): JSX.Element
    renderFetched?(data: any): JSX.Element
    renderFailure?(error: Error, retry: Function): JSX.Element
  }

  interface RelayProp {
    variables: any
    setVariables(variables: Object)
  }
}
