const API_BASE_URL = "http://127.0.0.1:8000";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "Something went wrong with the API request."
    );
  }

  return data;
}


/* ----------------------------- */
/* Health Check                   */
/* ----------------------------- */

export async function checkBackendHealth() {
  const response = await fetch(
    `${API_BASE_URL}/health`
  );

  return handleResponse(response);
}


/* ----------------------------- */
/* Get Jobs                       */
/* ----------------------------- */

export async function getJobs(search = "", limit = 10) {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  params.append("limit", limit);

  const response = await fetch(
    `${API_BASE_URL}/jobs?${params.toString()}`
  );

  return handleResponse(response);
}


/* ----------------------------- */
/* Match All Jobs                 */
/* ----------------------------- */

export async function matchAllJobs(
  resumeProfile,
  search = "",
  limit = 10
) {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  params.append("limit", limit);

  const response = await fetch(
    `${API_BASE_URL}/jobs/match-all?${params.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resumeProfile),
    }
  );

  return handleResponse(response);
}


/* ----------------------------- */
/* Upload Resume                  */
/* ----------------------------- */

export async function uploadResume(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/resume/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  return handleResponse(response);
}


/* ----------------------------- */
/* Get Applications               */
/* ----------------------------- */

export async function getApplications() {
  const response = await fetch(
    `${API_BASE_URL}/applications`
  );

  return handleResponse(response);
}


/* ----------------------------- */
/* Save Application               */
/* ----------------------------- */

export async function createApplication(application) {
  const response = await fetch(
    `${API_BASE_URL}/applications`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(application),
    }
  );

  return handleResponse(response);
}


/* ----------------------------- */
/* Update Application             */
/* ----------------------------- */

export async function updateApplication(
  applicationId,
  data
) {
  const response = await fetch(
    `${API_BASE_URL}/applications/${applicationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return handleResponse(response);
}


/* ----------------------------- */
/* Delete Application             */
/* ----------------------------- */

export async function deleteApplication(
  applicationId
) {
  const response = await fetch(
    `${API_BASE_URL}/applications/${applicationId}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(response);
}


/* ----------------------------- */
/* Customize Resume               */
/* ----------------------------- */

export async function customizeResume(
  resumeProfile,
  job
) {
  const response = await fetch(
    `${API_BASE_URL}/resume/customize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume_profile: resumeProfile,
        job: job,
      }),
    }
  );

  return handleResponse(response);
}


/* ----------------------------- */
/* Generate Resume                */
/* ----------------------------- */

export async function generateResume(
  resumeProfile,
  job
) {
  const response = await fetch(
    `${API_BASE_URL}/resume/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume_profile: resumeProfile,
        job: job,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData?.detail ||
      "Failed to generate resume."
    );
  }

  return response.blob();
}


/* ----------------------------- */
/* Automatic Job Search           */
/* ----------------------------- */

export async function autoSaveJobs({
  search = "",
  limit = 10,
  minimumScore = 70,
}) {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  params.append("limit", limit);
  params.append("minimum_score", minimumScore);

  const response = await fetch(
    `${API_BASE_URL}/jobs/auto-save?${params.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );

  return handleResponse(response);
}