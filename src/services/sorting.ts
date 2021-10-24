import { List, MediaInstants } from '../store/lists';
import { ListSortPreference, MediaSortPreference } from '../store/userPreferences';
import { SortingOptions } from './types';

export function sortLists(lists: List[], preference?: ListSortPreference): List[] {
  if (!lists || lists.length === 0) return [];

  if (preference === 'alpha+') {
    return sortValuesByProperty(lists, 'name', { isDescending: false });
  }
  if (preference === 'alpha-') {
    return sortValuesByProperty(lists, 'name', { isDescending: true });
  }
  if (preference === 'created+') {
    return sortValuesByProperty(lists, 'createdAt', { isDescending: false });
  }
  if (preference === 'created-') {
    return sortValuesByProperty(lists, 'createdAt', { isDescending: true });
  }

  return lists;
}

export function sortMediaInstantLists<UserMediaStore>(
  mediaInstants: MediaInstants[],
  userMediaStore: UserMediaStore,
  preference?: MediaSortPreference,
): MediaInstants[] {
  if (!mediaInstants || mediaInstants.length === 0) return [];

  if (preference === 'alpha+') {
    return sortMediaInstants(mediaInstants, userMediaStore, 'title', { isDescending: false });
  }
  if (preference === 'alpha-') {
    return sortMediaInstants(mediaInstants, userMediaStore, 'title', { isDescending: true });
  }
  if (preference === 'added+') {
    return sortMediaInstants(mediaInstants, userMediaStore, 'addedOn', { isDescending: false, useDateParse: true });
  }
  if (preference === 'added-') {
    return sortMediaInstants(mediaInstants, userMediaStore, 'addedOn', { isDescending: true, useDateParse: true });
  }
  if (preference === 'imdb+') {
    return sortMediaInstants(mediaInstants, userMediaStore, 'imdbRating', { isDescending: false, isNumber: true });
  }
  if (preference === 'imdb-') {
    return sortMediaInstants(mediaInstants, userMediaStore, 'imdbRating', { isDescending: true, isNumber: true });
  }
  if (preference === 'release+') {
    return sortMediaInstants(mediaInstants, userMediaStore, 'releaseYear', { isDescending: false, isNumber: true });
  }
  if (preference === 'release-') {
    return sortMediaInstants(mediaInstants, userMediaStore, 'releaseYear', { isDescending: true, isNumber: true });
  }

  return mediaInstants;
}

function sortValuesByProperty<ArrayType>(arr: ArrayType[], property: string, options: SortingOptions = {}) {
  return arr.sort((a, b) => {
    let valueA: never;
    let valueB: never;
    if (options.useDateParse) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      valueA = Date.parse(a[property]);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      valueB = Date.parse(a[property]);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      valueA = a[property].toUpperCase();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      valueB = b[property].toUpperCase();
    }

    if (valueA < valueB) return options.isDescending ? 1 : -1;
    if (valueA > valueB) return options.isDescending ? -1 : 1;
    return 0;
  });
}

function sortMediaInstants<ArrayType, UserMediaStore>(
  arr: ArrayType[],
  userMediaStore: UserMediaStore,
  property: string,
  options: SortingOptions = {},
) {
  return arr.sort((a, b) => {
    let valueA: never;
    let valueB: never;
    if (options.useDateParse) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      valueA = Date.parse(a.addedOn);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      valueB = Date.parse(b.addedOn);
    } else if (options.isNumber) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      valueA = Number(userMediaStore[a.userMedia]?.media[property]);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      valueB = Number(userMediaStore[b.userMedia]?.media[property]);
    } else if (options.useUserMedia) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      valueA = Date.parse(userMediaStore[a.userMedia]?.[property]);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      valueB = Date.parse(userMediaStore[b.userMedia]?.[property]);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      valueA = userMediaStore[a.userMedia]?.media[property]?.toUpperCase();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      valueB = userMediaStore[b.userMedia]?.media[property]?.toUpperCase();
    }

    if (!valueA || !valueB) return 0;
    if (valueA < valueB) return options.isDescending ? 1 : -1;
    if (valueA > valueB) return options.isDescending ? -1 : 1;
    return 0;
  });
}
