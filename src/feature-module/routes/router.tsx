
import {  Route, Routes } from "react-router";
import { authRoutes, publicRoutes} from "./router.link";
import AuthFeature from "../feathure-components/authFeature";
import Feature from "../feathure-components/feature";


const ALLRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Auth routes should be checked first, before the catch-all in publicRoutes */}
        <Route element={<AuthFeature />}>
          {authRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>

        <Route element={<Feature />}>
          {publicRoutes.map((route, idx) => (
            <Route path={route.path} element={route.element} key={idx} />
          ))}
        </Route>
      </Routes>
    </>
  );
};

export default ALLRoutes;
