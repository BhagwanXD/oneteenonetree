import * as React from 'react'

export default function ArticleIcon(props: React.SVGProps<SVGSVGElement>) {
  const { children, ...rest } = props
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      {children}
      <path fill="none" d="M0 0h24v24H0z"></path><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path><path d="M14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path>
    </svg>
  )
}
