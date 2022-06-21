import {
  createContext,
  useCallback,
  useState,
  useContext,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { api } from "../services/api";

const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [data, setData] = useState(() => {
    const token = localStorage.getItem("lanstad-token");
    const user = localStorage.getItem("lanstad-user");

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }

    return {};
  });
  const [permissions, setPermissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getPermissionsDataFromToken = async () => {
      const isTokenValid = await validateToken(data?.token);

      if (isTokenValid === true) {
        const lanstadPermisisons = handlePermissions(data?.user?.permissions);
        setPermissions(lanstadPermisisons);
      }
    };

    if (data?.token) {
      getPermissionsDataFromToken();
    }
  }, []);

  const validateToken = async (tokenValue) => {
    if (tokenValue) {
      // Idk why we need to use fetch only here, axios does not work on this request
      const response = await api.get("/token/check");
      if (response?.data?.valid) {
        return response?.data?.valid;
      }
      return false;
    }
    return false;
  };

  const decodeToken = (token) => {
    if (token) {
      const decodedToken = jwt_decode(token);
      return decodedToken;
    }
    const errorObject = {};
    return errorObject;
  };

  const getDataFromToken = async (tokenValue) => {
    const isTokenValid = await validateToken(tokenValue);
    if (isTokenValid === true) {
      return decodeToken(tokenValue);
    }

    return {};
  };

  const handlePermissions = (permission) => {
    const oupPermissions = permission?.permissionsMapped?.oup || false;
    const vxePermissions =
      permission?.permissionsMapped?.frontend?.vxe?.view || false;

    let lanstadPermissions = permission?.permissionsMapped?.frontend || {};

    lanstadPermissions = {
      ...lanstadPermissions,
      oupPermissions,
      vxePermissions,
    };

    return lanstadPermissions;
  };

  const signIn = useCallback(async ({ username, password }) => {
    const response = await api
      .post("/token/create", {
        username,
        password,
      })
      .catch(() => {
        localStorage.removeItem("lanstad-token");
        localStorage.removeItem("lanstad-user");
      });

    const { token } = response.data;

    if (token) {
      localStorage.setItem("lanstad-token", token);

      const wholeToken = await getDataFromToken(token);
      localStorage.setItem("lanstad-user", JSON.stringify(wholeToken.user));

      const permissionsLanstad = handlePermissions(wholeToken.user.permissions);

      setPermissions(permissionsLanstad);

      setData({
        token,
        user: wholeToken.user,
      });

      return true;
    }
    return false;
  }, []);

  const updateUserByToken = useCallback(
    async (token) => {
      localStorage.setItem("lanstad-token", token);
      const wholeToken = await getDataFromToken(token);
      localStorage.setItem("lanstad-user", JSON.stringify(wholeToken.user));

      const permissionsLanstad = handlePermissions(wholeToken.user.permissions);

      setPermissions(permissionsLanstad);

      setData({
        token,
        user: wholeToken.user,
      });
    },
    [data],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem("lanstad-token");
    localStorage.removeItem("lanstad-user");
    localStorage.removeItem("passwordJustReset");

    setData({});

    navigate("/login");
  }, []);

  // const value = useMemo(
  //   () => ({
  //     user: data.user,
  //     token: data.token,
  //     permissions,
  //     signIn,
  //     signOut,
  //   }),
  //   [data, permissions, signIn, signOut],
  // );

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        token: data.token,
        permissions,
        signIn,
        signOut,
        updateUserByToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
