import ArrowForwardIcon from './material/ArrowForwardIcon'
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
import LinkIcon from './material/LinkIcon'
import LocationOnIcon from './material/LocationOnIcon'
import LockIcon from './material/LockIcon'
import MailIcon from './material/MailIcon'
import MenuIcon from './material/MenuIcon'
import OpenInNewIcon from './material/OpenInNewIcon'
import PhotoCameraIcon from './material/PhotoCameraIcon'
import SearchIcon from './material/SearchIcon'
import SettingsIcon from './material/SettingsIcon'
import ShieldIcon from './material/ShieldIcon'
import SmartphoneIcon from './material/SmartphoneIcon'
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
  LinkIcon,
  LinkedinIcon,
  LocationOnIcon,
  LockIcon,
  MailIcon,
  MenuIcon,
  OpenInNewIcon,
  PhotoCameraIcon,
  SearchIcon,
  SettingsIcon,
  ShieldIcon,
  SmartphoneIcon,
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
  shield: ShieldIcon,
  verified: VerifiedIcon,
  mail: MailIcon,
  eco: EcoIcon,
  volunteer: VolunteerActivismIcon,
  groups: GroupsIcon,
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
