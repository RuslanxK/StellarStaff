const appReducer = (
  state = {
    formData: {
      fullname: "",
      firstName:"",
      lastName: "",
      phone: "", 
      email: "",
      age: "",
      profileImage: "",
      coverLetterText: "",
      hardwareImages: "",
      hardwareTest: [],
      internetSpeed: "",
      shortBio: "",
      password: "",
      cPassword: "",
      status: "Application Pending",
      industries: "",
      strengths: "",
      achievements: "",
      address: "",
      city: "",
      country: "",
      position: "",
      newResumePdf: "",
      isImproved: false,
      recordedVideo: "",
      skills: [],

      noEducation: false,

      experience: [
        {
          companyName: "",
          companyLocation: "",
          fromDate: "",
          toDate: "",
          description: "",
        },
      ],

      education: [
        {
          collageUniversity: "",
          educationTitle: "",
          fromDate: "",
          toDate: "",
        },
      ],

      computerScreenShot: "",
      videoData: "",
      videoAWS: "",
      linksAWS: [],
      internetSpeedAWS: "",
      aptitudeFile: "",
      aptitudeText: "",
      discFile: "",
      discText: "",
      englishFile: "",
      englishText: "",

      personalIdFile: "",
      governmentTax: "",
      vsnWaiver: "",
      completedApplication: true,
    },
  },
  
  action
) => {
  switch (action.type) {
      case "UPDATE_FORM_DATA":
        const updatedFormData = {
          ...state.formData,
          ...action.payload,
        };
    
        const fullName =
          updatedFormData.firstName !== "" && updatedFormData.lastName !== ""
            ? updatedFormData.firstName + " " + updatedFormData.lastName
            : "";
    
        const updateForm = {
          ...state,
          formData: {
            ...updatedFormData,
            fullname: fullName,
          },
        };
        console.log(state.formData);
        return updateForm;
       
      default:
        return state;
    }
    

};

export default appReducer;
