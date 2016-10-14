import {reloadDataAsync, loadDataAsync, addNodeAsync, updateNodeAsync, deleteSelectedNodes} from '../data'
import mockStore from 'redux-mock-store'
import * as lokka from 'lokka'
import * as Immutable from 'immutable'
import {GettingStartedState} from '../../../types/gettingStarted'
import {ActionRowState} from '../../../types/databrowser/actionrow'

describe('async data actions', () => {
  const store = mockStore({
    databrowser: {
      ui: {
        searchVisible: false,
        newRowActive: false,
        selectedNodeIds: Immutable.List<string>(['cink6lsyw002e01rnakgeqdy5']),
        scrollTop: 0,
        loading: true,
        writing: false,
        actionRow: ActionRowState.NewNode,
        selectedCell: {
          row: -1,
          field: null,
        },
        editing: false,
        browserViewRef: null,
        searchQuery: null,
      },
      data: {
        nodes: Immutable.List<Immutable.Map<string, any>>(),
        backup: {
          nodes: Immutable.List<Immutable.Map<string, any>>(),
          itemCount: 0,
          loaded: Immutable.List<boolean>(),
        },
        orderBy: {
          fieldName: 'id',
          order: 'DESC',
        },
        filter: Immutable.Map<string, any>(),
        itemCount: 0,
        loaded: Immutable.List<boolean>(),
        mutationActive: false,
        searchQuery: '',
      },
    },
    gettingStarted: {
      gettingStartedState: {
        poll: false,
        gettingStartedState: new GettingStartedState({
          onboardingStatusId: '',
          selectedExample: null,
          skipped: true,
          step: 'STEP6_CLOSED',
        }),
      }
    }
  })

  const fields = [
    {
      id: 'cip3p48sj001d1jsmzqysd6xd',
      name: 'id',
      description: '',
      isReadonly: true,
      isList: false,
      isSystem: true,
      typeIdentifier: 'GraphQLID',
      relatedModel: null,
    },
    {
      id: 'cip3p48sj001e1jsmghwkdt2k',
      name: 'description',
      description: '',
      isReadonly: true,
      isList: false,
      isSystem: true,
      typeIdentifier: 'DateTime',
      relatedModel: null,
    },
    {
      id: 'cip3p48sj001f1jsm5z015zjt',
      name: 'name',
      description: '',
      isReadonly: true,
      isList: false,
      isSystem: true,
      typeIdentifier: 'DateTime',
      relatedModel: null,
    },
    {
      id: 'cip3p48sj001g1jsmj8t36lpg',
      name: 'artwork',
      description: '',
      isReadonly: true,
      isList: false,
      isSystem: true,
      typeIdentifier: 'Relation',
      relatedModel: {
        name: 'Image',
      },
    },
  ]

  const model = {
    fields,
    itemCount: 3,
    name: 'Artist',
    namePlural: 'Artists',
  }

  const fieldValues = {
    description: {
      field: fields[1],
      value: 'some description',
    },
    name: {
      field: fields[2],
      value: 'some name',
    },
    artworkId: {
      field: fields[3],
      value: 'asdlkasdlj',
    },
  }

  it('should run loadDataAsync', () => {
    return store
      .dispatch(loadDataAsync(lokka, 'Artists', fields, 0, 3))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot()
      })
      .catch(() => {
        expect(false).toBe(true)
      })
  })

  it('should run reloadDataAsync', () => {
    return store
      .dispatch(reloadDataAsync(lokka, 'Artists', fields, 0))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot()
      })
      .catch(() => {
        expect(false).toBe(true)
      })
  })

  it('should add a node async', () => {
    return store
      .dispatch(addNodeAsync(lokka, model, fields, fieldValues))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot()
      })
      .catch((e) => {
        console.error(e)
        expect(false).toBe(true)
      })
  })

  it('should update a node async', () => {
    return store
      .dispatch(updateNodeAsync(
        lokka,
        model,
        fields,
        'somedescription',
        fields[1],
        () => {/* */},
        'ciu9st9820sgt0128cviki4sf',
        0
      ))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot()
      })
      .catch((e) => {
        expect(false).toBe(true)
      })
  })

  it('should delete a node async', () => {
    return store
      .dispatch(deleteSelectedNodes(
        lokka,
        'some project',
        'Artist',
      ))
      .then(() => {
        expect(store.getActions()).toMatchSnapshot()
      })
      .catch((e) => {
        expect(false).toBe(true)
      })
  })

})
