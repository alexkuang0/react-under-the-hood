import { useEffect, useMemo, useState } from "."

const [name1, setName1] = useState("Alice")
const [name2, setName2] = useState("Bob")

const [show2, setShow2] = useState(true)

const whoIsThere = useMemo(() => {
  if (!show2()) return name1()
  return `${name1()} and ${name2()}`
})

useEffect(() => {
  console.log(`Who is there? ${whoIsThere()}`)
})
// first render: "Who is there? Alice and Bob"

setName1("Eve")
// second render: "Who is there? Eve and Bob"

setShow2(false)
// third render: "Who is there? Eve"

setName2("Charlie")
// does not render
