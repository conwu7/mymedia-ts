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
};

export type ListsState = {
  towatch: List[];
  towatchtv: List[];
  completed: List[];
  completedtv: List[];
};

const initialState: ListsState = {
  towatch: [],
  towatchtv: [],
  completed: [],
  completedtv: [],
};

const listsReducer = (state: ListsState = initialState, action: ListsAction): ListsState => {
  switch (action.type) {
    case 'storeList':
      return {
        ...state,
        [action.listType]: action.data,
      };
    default:
      return state;
  }
};

export default listsReducer;
