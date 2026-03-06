'use client'

import { Container, Row, Col, Button } from 'react-bootstrap'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <>
      <html>
        <body>
          <h2>Something went wrong!</h2>
        </body>
      </html>
    </>

  )
}