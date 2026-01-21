import ArrowForwardIcon from './material/ArrowForwardIcon'
import ArticleIcon from './material/ArticleIcon'
import CalendarMonthIcon from './material/CalendarMonthIcon'
import ChecklistIcon from './material/ChecklistIcon'
import ChevronRightIcon from './material/ChevronRightIcon'
import CloseIcon from './material/CloseIcon'
import DashboardIcon from './material/DashboardIcon'
import DeleteIcon from './material/DeleteIcon'
import DownloadIcon from './material/DownloadIcon'
import EcoIcon from './material/EcoIcon'
import EmojiEventsIcon from './material/EmojiEventsIcon'
import ExpandMoreIcon from './material/ExpandMoreIcon'
import GroupsIcon from './material/GroupsIcon'
import HelpIcon from './material/HelpIcon'
import InfoIcon from './material/InfoIcon'
import LeaderboardIcon from './material/LeaderboardIcon'
import LinkIcon from './material/LinkIcon'
import LocationOnIcon from './material/LocationOnIcon'
import LockIcon from './material/LockIcon'
import MailIcon from './material/MailIcon'
import MenuIcon from './material/MenuIcon'
import NewspaperIcon from './material/NewspaperIcon'
import OpenInNewIcon from './material/OpenInNewIcon'
import PersonIcon from './material/PersonIcon'
import PhotoCameraIcon from './material/PhotoCameraIcon'
import SearchIcon from './material/SearchIcon'
import SettingsIcon from './material/SettingsIcon'
import ShareIcon from './material/ShareIcon'
import ShieldIcon from './material/ShieldIcon'
import SmartphoneIcon from './material/SmartphoneIcon'
import SportsEsportsIcon from './material/SportsEsportsIcon'
import SyncIcon from './material/SyncIcon'
import UploadIcon from './material/UploadIcon'
import VerifiedIcon from './material/VerifiedIcon'
import VolunteerActivismIcon from './material/VolunteerActivismIcon'

import InstagramIcon from './brand/InstagramIcon'
import LinkedinIcon from './brand/LinkedinIcon'
import TwitterIcon from './brand/TwitterIcon'
import YoutubeIcon from './brand/YoutubeIcon'

export {
  ArrowForwardIcon,
  ArticleIcon,
  CalendarMonthIcon,
  ChecklistIcon,
  ChevronRightIcon,
  CloseIcon,
  DashboardIcon,
  DeleteIcon,
  DownloadIcon,
  EcoIcon,
  EmojiEventsIcon,
  ExpandMoreIcon,
  GroupsIcon,
  HelpIcon,
  InfoIcon,
  InstagramIcon,
  LeaderboardIcon,
  LinkIcon,
  LinkedinIcon,
  LocationOnIcon,
  LockIcon,
  MailIcon,
  MenuIcon,
  NewspaperIcon,
  OpenInNewIcon,
  PersonIcon,
  PhotoCameraIcon,
  SearchIcon,
  SettingsIcon,
  ShareIcon,
  ShieldIcon,
  SmartphoneIcon,
  SportsEsportsIcon,
  SyncIcon,
  TwitterIcon,
  UploadIcon,
  VerifiedIcon,
  VolunteerActivismIcon,
  YoutubeIcon,
}

export const iconMap = {
  menu: MenuIcon,
  close: CloseIcon,
  chevronDown: ExpandMoreIcon,
  chevronRight: ChevronRightIcon,
  arrowForward: ArrowForwardIcon,
  externalLink: OpenInNewIcon,
  search: SearchIcon,
  info: InfoIcon,
  help: HelpIcon,
  lock: LockIcon,
  user: PersonIcon,
  shield: ShieldIcon,
  verified: VerifiedIcon,
  mail: MailIcon,
  eco: EcoIcon,
  volunteer: VolunteerActivismIcon,
  groups: GroupsIcon,
  leaderboard: LeaderboardIcon,
  share: ShareIcon,
  article: ArticleIcon,
  newspaper: NewspaperIcon,
  games: SportsEsportsIcon,
  location: LocationOnIcon,
  calendar: CalendarMonthIcon,
  camera: PhotoCameraIcon,
  dashboard: DashboardIcon,
  settings: SettingsIcon,
  upload: UploadIcon,
  checklist: ChecklistIcon,
  link: LinkIcon,
  sync: SyncIcon,
  delete: DeleteIcon,
  download: DownloadIcon,
  award: EmojiEventsIcon,
  smartphone: SmartphoneIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  youtube: YoutubeIcon,
} as const

export type IconName = keyof typeof iconMap
