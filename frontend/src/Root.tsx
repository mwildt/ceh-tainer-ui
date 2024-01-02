import { Outlet } from "react-router";

export default function Root () {

  return <>
    <main id="detail">
        <Outlet />
    </main>
  </>
  
}


