import {Step} from './gettingStarted'

interface RelayConnection<T> {
  edges: RelayEdge<T>[]
}

interface RelayEdge<T> {
  node: T
}

export interface Viewer {
  id: string
  user: Customer
}

export interface Customer {
  id: string
  projects: RelayConnection<Project>
  crm: CrmSystemBridge
}

export interface CrmSystemBridge {
  id: string
  information: CrmCustomerInformation
  onboardingStatus: CrmOnboardingStatus
}

export interface CrmCustomerInformation {
  id: string
  name: string
  email: string
}

export type Example = 'ReactRelay' | 'ReactApollo' | 'AngularApollo'

export interface CrmOnboardingStatus {
  id: string
  gettingStarted: Step
  gettingStartedSkipped: boolean
  gettingStartedExample: Example | null
}

export interface Project {
  id: string
  name: string
  models: RelayConnection<Model>
  relations: RelayConnection<Relation>
  actions: RelayConnection<Action>
  permanentAuthTokens: RelayConnection<PermanentAuthToken>
  actionSchema: string
}

export type FieldType = 'Relation' | 'Int' | 'String' | 'Boolean' | 'Enum' | 'Float' | 'DateTime' | 'Password' | 'Json'

export interface Field {
  id: string
  name: string
  description: string
  isRequired: boolean
  isList: boolean
  isUnique: boolean
  isSystem: boolean
  isReadOnly: boolean
  typeIdentifier: FieldType
  defaultValue?: string
  enumValues: string[]
  reverseRelationField?: Field
  relatedModel?: Model
  relation?: Relation
  permissions: RelayConnection<Permission>
  model: Model
}

export interface Relation {
  id: string
  name: string
  description?: string
  leftModel: Model
  rightModel: Model
  fieldOnLeftModel: Field
  fieldOnRightModel: Field
}

export type UserType = 'GUEST' | 'AUTHENTICATED' | 'RELATED'

export interface Permission {
  id: string
  userType: UserType
  userPath: string[]
  userRole: string
  allowRead: boolean
  allowCreate: boolean
  allowUpdate: boolean
  allowDelete: boolean
  description: string
}

export interface Model {
  id: string
  name: string
  namePlural: string
  fields: RelayConnection<Field>
  unconnectedReverseRelationFieldsFrom: Field[]
  itemCount: number
  description: string
  isSystem: boolean
}

export type ActionTriggerType = 'MUTATION_MODEL' | 'MUTATION_RELATION'
export type ActionHandlerType = 'WEBHOOK'

export interface Action {
  id: string
  isActive: boolean
  description: string
  triggerType: ActionTriggerType
  handlerType: ActionHandlerType
  triggerMutationModel?: ActionTriggerMutationModel
  triggerMutationRelation?: ActionTriggerMutationRelation
  handlerWebhook?: ActionHandlerWebhook
}

export type ActionTriggerMutationModelMutationType = 'CREATE' | 'UPDATE' | 'DELETE'

export interface ActionTriggerMutationModel {
  id: string
  fragment: string
  model: Model
  mutationType: ActionTriggerMutationModelMutationType
}

export type ActionTriggerMutationRelationMutationType = 'ADD' | 'REMOVE'

export interface ActionTriggerMutationRelation {
  id: string
  fragment: string
  relation: Relation
  mutationType: ActionTriggerMutationRelationMutationType
}

export interface ActionHandlerWebhook {
  id: string
  url: string
}

export interface User {
  id: string
  email: string
  roles: string[]
}

export interface Node {
  id: string
  [key: string]: any
}

export interface PermanentAuthToken {
  id: string
  name: string
  token: string
}

export interface AuthProvider {
  type: AuthProviderType
  digits: AuthProviderDigits | null
  auth0: AuthProviderAuth0 | null
}

export type AuthProviderType = 'Digits' | 'EmailPassword' | 'Auth0'

export interface AuthProviderAuth0 {
  domain: string
  clientId: string
  clientSecret: string
  methodFacebook: boolean
  methodTwitter: boolean
  methodGoogle: boolean
}

export interface AuthProviderDigits {
  consumerKey: string
  consumerSecret: string
}

export interface OrderBy {
  fieldName: string
  order: 'ASC' | 'DESC'
}
