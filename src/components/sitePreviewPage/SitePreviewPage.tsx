import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import mediaActions from '../../images/sample-photos/media-actions_iphone12black_portrait.png';
import mediaListsPage from '../../images/sample-photos/media-lists_iphone12black_portrait.png';
import mediaInfo from '../../images/sample-photos/media-more-info_iphone12black_portrait.png';
import mediaStatusNotes from '../../images/sample-photos/media-status-notes_iphone12black_portrait.png';
import search from '../../images/sample-photos/search_iphone12black_portrait.png';

import style from './style.module.scss';

export default function SitePreviewPage(): JSX.Element {
  const samples = [
    {
      image: mediaListsPage,
      count: 1,
      description: [
        'Create custom lists with unique names and descriptions',
        'Add movies/shows to your lists from the search page',
        'Set the list and item sort preferences to your liking',
      ],
    },
    {
      image: mediaActions,
      count: 2,
      description: ['Perform actions on each item', 'Changes can be seen on the item when viewed from multiple lists'],
    },
    {
      image: mediaStatusNotes,
      count: 3,
      description: [
        'Add watch notes that you can view later on',
        "If you've watched it, add review notes and rate the item",
        "All these will show up in the 'More Info' section of each item",
      ],
    },
    {
      image: mediaInfo,
      count: 4,
      description: [
        "View more information on each item that isn't available in the quick glance view",
        "See your saved watch notes. (Your review section shows up if you've marked the item as watched)",
      ],
    },
    {
      image: search,
      count: 5,
      description: ['Search for movies and shows and add them to your lists'],
    },
  ];
  return (
    <div className={style.siteSample}>
      {samples.map((sample, index) => (
        <Paper key={index} className={style.previewItem}>
          {sample.description.map((line, index) => (
            <Typography key={index} className={style.previewText}>
              {line}
            </Typography>
          ))}
          <div className={style.previewImageContainer}>
            <img src={sample.image} alt="Phone screenshot" className={style.previewImage} />
          </div>
        </Paper>
      ))}
    </div>
  );
}
