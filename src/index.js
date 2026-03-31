import './style.css'
import { contentContainerToday, sidebarContainerToday } from './views/today.js'

const body = document.querySelector('body')
const sidebarToday = sidebarContainerToday.sidebar
const contentToday = contentContainerToday.root

body.append(sidebarToday, contentToday)