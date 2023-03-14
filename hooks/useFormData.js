import { useState, useCallback } from "react";

const initialValues = {
  email: "",
  password: "",
};
const useFormData = () => {
  const [user, setUser] = useState(initialValues);

  const userForm = useCallback((e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  return {
    user,
    userForm,
  };
};
export default useFormData;
