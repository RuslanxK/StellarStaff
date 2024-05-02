const clientReducer = (
  state = {
    clientFormData: {
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      companyName: "",
      phone: "",
      email: "",
      lookingFor: "",
      jobType: "",
      requiredSkills: [],
      currentStage: "",
    },
  },
  action
) => {
  switch (action.type) {
    case "UPDATE_CLIENT_DATA":
      return {
        ...state,
        clientFormData: {
          ...state.clientFormData,
          ...action.payload,
        },
      };

    default:
      return state;
  }
};

export default clientReducer;
