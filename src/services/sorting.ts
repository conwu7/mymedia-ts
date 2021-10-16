import { List } from '../store/lists';
import { ListSortPreference } from '../store/userPreferences';

export function sortLists(lists: List[], preference?: ListSortPreference): List[] {
  if (!lists || lists.length === 0) return [];

  if (preference === 'alpha+') {
    return listsSortedByNames(lists, false);
  }
  if (preference === 'alpha-') {
    return listsSortedByNames(lists, true);
  }
  if (preference === 'created+') {
    return listsSortedByDate(lists, false);
  }
  if (preference === 'created-') {
    return listsSortedByDate(lists, true);
  }

  return lists;
}

function listsSortedByNames(arr: List[], isDescending?: boolean) {
  return arr.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) return isDescending ? 1 : -1;
    if (nameA > nameB) return isDescending ? -1 : 1;
    return 0;
  });
}

function listsSortedByDate(arr: List[], isDescending?: boolean) {
  return arr.sort((a, b) => {
    const dateA = Date.parse(a.createdAt);
    const dateB = Date.parse(b.createdAt);
    if (dateA < dateB) return isDescending ? 1 : -1;
    if (dateA > dateB) return isDescending ? -1 : 1;
    return 0;
  });
}
