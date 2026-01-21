import * as React from 'react'

export default function SmartphoneIcon(props: React.SVGProps<SVGSVGElement>) {
  const { children, ...rest } = props
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      {children}
      <path fill="none" d="M0 0h24v24H0V0z"></path><path d="M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"></path>
    </svg>
  )
}
