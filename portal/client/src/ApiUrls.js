export const API_BASE_URL = process.env.REACT_APP_API_URL

// Client's urls

export const getAllRecruitersUrl = (q) => `${API_BASE_URL}/api/recruiters/all?q=${q}`;
export const updateClientUrl = (clientId) => `${API_BASE_URL}/api/recruiter/${clientId}`;
export const deleteClientUrl = (clientId) => `${API_BASE_URL}/api/recruiter/${clientId}`;
export const createNewClientUrl = `${API_BASE_URL}/api/recruiters`;
export const getAllClientsUrl = `${API_BASE_URL}/api/recruiters/all?q=`;
export const getClientByIdUrl = (clientId) => `${API_BASE_URL}/api/recruiter/${clientId}`
export const loginClient = `${API_BASE_URL}/api/recruiter/login`

// Va's urls

export const getAllVAsWithQUrl = (q) => `${API_BASE_URL}/api/vas/all?q=${q}`;
export const getAllVAsUrl = `${API_BASE_URL}/api/vas/all?q=`;
export const updateVAUrl = (vaId) => `${API_BASE_URL}/api/vas/${vaId}`;
export const updateVAapplication = (vaId) => `${API_BASE_URL}/api/vas/application/${vaId}`;
export const updateVAapplicationUpload = (vaId) => `${API_BASE_URL}/api/vas/application/upload/${vaId}`;
export const updateVAapplicationFileUpload = (vaId) => `${API_BASE_URL}/api/vas/application/upload/file/${vaId}`;
export const deleteVAUrl = (vaId) => `${API_BASE_URL}/api/vas/${vaId}`;
export const getVaByIdUrl = (vaId) => `${API_BASE_URL}/api/vas/${vaId}`;
export const registerVa = `${API_BASE_URL}/api/vas`
export const loginVa = `${API_BASE_URL}/api/vas/login`

// Admin's urls

export const adminLoginUrl = `${API_BASE_URL}/api/admins/login`;
export const getAllAdminsUrl = `${API_BASE_URL}/api/admins/all`;
export const getAdminUrl = (adminId) => `${API_BASE_URL}/api/admin/${adminId}`;


// ChangeLog urls

export const getAllChangeLogs = `${API_BASE_URL}/api/tasks/all`
export const addTask = `${API_BASE_URL}/api/tasks`
export const removeTask = (taskId) => `${API_BASE_URL}/api/task/${taskId}`
export const updateTask = (taskId) => `${API_BASE_URL}/api/task/${taskId}`



// skills urls
export const getAllSkills = `${API_BASE_URL}/api/skills/all`
export const addUpdateSkills =(id) =>  `${API_BASE_URL}/api/skill/${id}`

// languages urls
export const getAllLangs = `${API_BASE_URL}/api/languages/all`
export const addUpdateLang = (id) => `${API_BASE_URL}/api/language/${id}`

// Client Stage urls
export const getAllClientStages = `${API_BASE_URL}/api/clientStages/all`
export const addUpdateClientStage = (id) => `${API_BASE_URL}/api/clientStage/${id}`

// Va Stage urls
export const getAllVaStages = `${API_BASE_URL}/api/vaStages/all`
export const addUpdateVaStage = (id) => `${API_BASE_URL}/api/vaStage/${id}`