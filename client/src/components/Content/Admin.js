import Swal from "sweetalert2";
import { useEffect, useContext, useState, useCallback } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { Navi } from "../../style/Admin";
import io from "socket.io-client";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";
import { Context } from "../../utils/stateProvider";
import { Main } from "./adm";
import axios from "axios";

function Admin() {
  const [toastPop, STP] = useState(false);
  document.querySelector("body").style.backgroundColor = "white";

  const store = useContext(Context);
  const socket = io({ query: { token: store.token } });

  const setToastPop = useCallback(() => STP(!toastPop), [toastPop, STP]);

  useEffect(() => {
    const Toast = Swal.mixin(store.config.sweetal.Toaster);

    if (!toastPop) {
      Toast.fire({
        icon: "success",
        title: store.isNewLogin ? "Login sukses" : "Selamat datang kembali",
      });
      setToastPop();
    }
  });

  socket.on(
    "admin:new user",
    (d) =>
      !store.log.find((x) => x.id === d.id && x.type === "new login") &&
      store.addLog(d)
  );

  const { path, url } = useRouteMatch();

  return (
    <Router>
      <Navi variant="dark">
        <Container>
          <Navbar.Brand as={Link} to={url}>
            Admin Panel
          </Navbar.Brand>
          <Nav className="my-auto">
            <Nav.Link as={Link} to={`${url}/paslon`}>
              Paslon
            </Nav.Link>
            <Nav.Link as={Link} to={`${url}/siswa`}>
              Siswa
            </Nav.Link>
            <Nav.Link as={Link} to={`${url}/guru`}>
              Guru
            </Nav.Link>
            <Button
              variant="danger"
              onClick={() => {
                Swal.fire(store.config.sweetal.Logout).then((result) => {
                  if (result.isConfirmed) {
                    axios.delete("/auth/logout").then(({ data }) => {
                      socket.disconnect();
                      store.Logout();
                      Swal.mixin(store.config.sweetal.Toaster).fire({
                        icon: "success",
                        title: data.message,
                      });
                    });
                  }
                });
              }}
            >
              Logout
            </Button>
          </Nav>
        </Container>
      </Navi>
      <Switch>
        <Route
          exact
          path={path}
          component={() => <Main connected={socket.connected} />}
        />
      </Switch>
    </Router>
  );
}

export default Admin;
