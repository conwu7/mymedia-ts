export type MediaInstants = {
  _id: string;
  userMedia: string;
  imdbID: string;
  addedOn: string;
  updatedAt: string;
};

export type List = {
  isPrivate: boolean;
  _id: string;
  name: string;
  description?: string;
  mediaInstants: MediaInstants[];
  createdAt: string;
  updatedAt: string;
};
export type ListsAction = {
  type: string;
  listType: 'towatch' | 'towatchtv' | 'completed' | 'completedtv';
  data: List[];
  list: List;
  listToDelete: string;
};

export type ListsState = {
  towatch: ListReference;
  towatchtv: ListReference;
  completed: ListReference;
  completedtv: ListReference;
};

export type ListReference = {
  [key: string]: List;
};

const initialState: ListsState = {
  towatch: {},
  towatchtv: {},
  completed: {},
  completedtv: {},
};

const listsReducer = (state: ListsState = initialState, action: ListsAction): ListsState => {
  switch (action.type) {
    case 'storeList':
      return {
        ...state,
        [action.listType]: action.data?.reduce((acc, list) => {
          acc[list._id] = list;
          return acc;
        }, {} as ListReference),
      };

    case 'createList':
    case 'updateList': {
      const updatedCategory = {
        ...state[action.listType],
        [action.list._id]: action.list,
      };
      return {
        ...state,
        [action.listType]: updatedCategory,
      };
    }
    case 'deleteList': {
      const { [action.listToDelete]: idToDelete, ...otherProps } = state[action.listType];
      if (!idToDelete) return state;
      return {
        ...state,
        [action.listType]: otherProps,
      };
    }

    default:
      return state;
  }
};

export default listsReducer;
