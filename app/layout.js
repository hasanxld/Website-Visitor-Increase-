export const metadata = {
  title: 'Website Viewer Tool',
  description: 'Super fast website viewer with unlimited views',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-space-grotesk">
        {children}
      </body>
    </html>
  )
}
