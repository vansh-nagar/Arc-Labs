import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerDemo } from "@/components/ui/date-picker";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { generateResumeDataStore } from "@/stores/generate_resume_p1";

const ManualForm = () => {
  const [isSmall, setIsSmall] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    linkedInProfile: "",
    githubProfile: "",
    portfolioURL: "",
  });

  const [newSkill, setNewSkill] = useState({ type: "", names: "" });

  const [skillArr, setSkillArr] = useState<(typeof newSkill)[]>([]);

  const [newEducation, setNewEducation] = useState({
    course: "",
    institutionName: "",
    educationLocation: "",
    educationStartDate: null as Date | null,
    educationEndDate: null as Date | null,
    cgpa: "",
  });

  const [educationArr, setEducationArr] = useState<(typeof newEducation)[]>([]);

  const [newWorkExperience, setNewWorkExperience] = useState({
    companyName: "",
    role: "",
    workExperienceStartDate: null as Date | null,
    workExperienceEndDate: null as Date | null,
    responsibilities: "",
    skills: "",
    technicalSkills: "",
    softSkills: "",
  });

  const [workExperienceArr, setWorkExperienceArr] = useState<
    (typeof newWorkExperience)[]
  >([]);

  const [newProject, setNewProject] = useState({
    projectName: "",
    description: "",
    projectLink: "",
    technologiesUsed: "",
  });

  const [projectsArr, setProjectsArr] = useState<(typeof newProject)[]>([]);

  const [newCertification, setNewCertification] = useState({
    title: "",
    issuer: "",
    link: "",
    date: null as Date | null,
  });

  const [certificationsArr, setCertificationsArr] = useState<
    (typeof newCertification)[]
  >([]);

  const [hobbies, setHobbies] = useState("");
  const [jobTitle, setJobTitle] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<any>
  ) => {
    const { name, value } = e.target;
    setState((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (
    date: Date | null,
    name: string,
    setState: React.Dispatch<any>
  ) => {
    setState((prev: any) => ({ ...prev, [name]: date }));
  };

  const { setData, setType } = generateResumeDataStore();

  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 620);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleSubmit = () => {
    if (isLoading) return;
    setIsLoading(true);

    setData({
      personalInfo,
      skillArr,
      educationArr,
      workExperienceArr,
      projectsArr,
      certificationsArr,
      jobTitle,
    });
    setType("manual");
    toast.success("Data saved successfully!");
    setIsLoading(false);
    router.push("/dashboard/generate-resume/page2/new");
  };

  const content = (
    <div className="flex flex-col gap-6 ml-4 max-sm:m-0 w-full">
      {/* Personal Information */}
      <form className="flex flex-col gap-2" title="Personal Information">
        <h1 className="text-xl truncate">Personal Information</h1>
        <Input
          placeholder="Name"
          name="name"
          onChange={(e) => handleChange(e, setPersonalInfo)}
          value={personalInfo.name}
        />
        <Input
          placeholder="Email"
          type="email"
          name="email"
          onChange={(e) => handleChange(e, setPersonalInfo)}
          value={personalInfo.email}
        />
        <Input
          placeholder="Phone Number"
          type="tel"
          name="phoneNumber"
          onChange={(e) => handleChange(e, setPersonalInfo)}
          value={personalInfo.phoneNumber}
        />
        <Input
          placeholder="Address (optional)"
          name="address"
          onChange={(e) => handleChange(e, setPersonalInfo)}
          value={personalInfo.address}
        />
        <Input
          placeholder="LinkedIn Profile URL"
          name="linkedInProfile"
          onChange={(e) => handleChange(e, setPersonalInfo)}
          value={personalInfo.linkedInProfile}
        />
        <Input
          placeholder="GitHub Profile URL"
          name="githubProfile"
          onChange={(e) => handleChange(e, setPersonalInfo)}
          value={personalInfo.githubProfile}
        />
        <Input
          placeholder="Portfolio URL"
          name="portfolioURL"
          onChange={(e) => handleChange(e, setPersonalInfo)}
          value={personalInfo.portfolioURL}
        />
      </form>

      {/* Skills Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSkillArr([...skillArr, newSkill]);
          setNewSkill({
            type: "",
            names: "",
          });
        }}
        className="flex flex-col gap-2"
        title="Skills"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl truncate">Skills</h1>
          <button type="submit">
            <Plus className=" hover:text-neutral-400 " />
          </button>
        </div>
        <Input
          placeholder="Skill type"
          name="type"
          onChange={(e) => handleChange(e, setNewSkill)}
          value={newSkill.type}
        />

        <Input
          name="names"
          placeholder="Skill name"
          onChange={(e) => handleChange(e, setNewSkill)}
          value={newSkill.names}
        />
      </form>
      {/* Education Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setEducationArr([...educationArr, newEducation]);
          setNewEducation({
            course: "",
            institutionName: "",
            educationLocation: "",
            educationStartDate: null,
            educationEndDate: null,
            cgpa: "",
          });
        }}
        className="flex flex-col gap-2"
        title="Education"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl truncate">Education</h1>
          <button type="submit">
            <Plus className=" hover:text-neutral-400 " />
          </button>
        </div>
        <Input
          placeholder="Degree / Course"
          name="course"
          onChange={(e) => handleChange(e, setNewEducation)}
          value={newEducation.course}
        />
        <Input
          placeholder="Institution Name"
          name="institutionName"
          onChange={(e) => handleChange(e, setNewEducation)}
          value={newEducation.institutionName}
        />
        <Input
          placeholder="Location"
          name="educationLocation"
          onChange={(e) => handleChange(e, setNewEducation)}
          value={newEducation.educationLocation}
        />
        <div className="flex sm:flex-nowrap flex-wrap gap-2">
          <div className="sm:w-1/2 w-full">
            <label className="mb-1 block text-sm">Start Date</label>
            <DatePickerDemo
              onChange={(date: Date | null) =>
                handleDateChange(date, "educationStartDate", setNewEducation)
              }
            />
          </div>
          <div className="sm:w-1/2 w-full">
            <label className="mb-1 block text-sm">End Date</label>
            <DatePickerDemo
              onChange={(date: Date | null) =>
                handleDateChange(date, "educationEndDate", setNewEducation)
              }
            />
          </div>
        </div>
        <Input
          name="cgpa"
          placeholder="CGPA / Percentage"
          onChange={(e) => handleChange(e, setNewEducation)}
          value={newEducation.cgpa}
        />
      </form>

      {/* Work Experience Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setWorkExperienceArr([...workExperienceArr, newWorkExperience]);
          setNewWorkExperience({
            companyName: "",
            role: "",
            workExperienceStartDate: null,
            workExperienceEndDate: null,
            responsibilities: "",
            skills: "",
            technicalSkills: "",
            softSkills: "",
          });
        }}
        className="flex flex-col gap-2"
        title="Work Experience"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl truncate">Work Experience</h1>
          <button type="submit">
            <Plus className="cursor-pointer hover:text-neutral-400" />
          </button>
        </div>
        <Input
          placeholder="Company Name"
          name="companyName"
          onChange={(e) => handleChange(e, setNewWorkExperience)}
          value={newWorkExperience.companyName}
        />
        <Input
          placeholder="Role / Position"
          name="role"
          onChange={(e) => handleChange(e, setNewWorkExperience)}
          value={newWorkExperience.role}
        />
        <div className="flex sm:flex-nowrap flex-wrap gap-2">
          <div className="sm:w-1/2 w-full">
            <label className="mb-1 block text-sm">Start Date</label>
            <DatePickerDemo
              onChange={(date: Date | null) =>
                handleDateChange(
                  date,
                  "workExperienceStartDate",
                  setNewWorkExperience
                )
              }
            />
          </div>
          <div className="sm:w-1/2 w-full">
            <label className="mb-1 block text-sm">End Date</label>
            <DatePickerDemo
              onChange={(date: Date | null) =>
                handleDateChange(
                  date,
                  "workExperienceEndDate",
                  setNewWorkExperience
                )
              }
            />
          </div>
        </div>
        <Input
          placeholder="Responsibilities / Achievements"
          name="responsibilities"
          onChange={(e) => handleChange(e, setNewWorkExperience)}
          value={newWorkExperience.responsibilities}
        />
        <Input
          placeholder="Skills"
          name="skills"
          onChange={(e) => handleChange(e, setNewWorkExperience)}
          value={newWorkExperience.skills}
        />
        <Input
          placeholder="Technical Skills"
          name="technicalSkills"
          onChange={(e) => handleChange(e, setNewWorkExperience)}
          value={newWorkExperience.technicalSkills}
        />
        <Input
          placeholder="Soft Skills"
          name="softSkills"
          onChange={(e) => handleChange(e, setNewWorkExperience)}
          value={newWorkExperience.softSkills}
        />
      </form>

      {/* Projects Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setProjectsArr([...projectsArr, newProject]);
          setNewProject({
            projectName: "",
            description: "",
            projectLink: "",
            technologiesUsed: "",
          });
        }}
        className="flex flex-col gap-2"
        title="Projects"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl">Projects</h1>
          <button type="submit">
            <Plus className="cursor-pointer hover:text-neutral-400" />
          </button>
        </div>
        <Input
          placeholder="Project Name"
          name="projectName"
          onChange={(e) => handleChange(e, setNewProject)}
          value={newProject.projectName}
        />
        <Input
          placeholder="Description"
          name="description"
          onChange={(e) => handleChange(e, setNewProject)}
          value={newProject.description}
        />
        <Input
          placeholder="Link / GitHub URL"
          name="projectLink"
          onChange={(e) => handleChange(e, setNewProject)}
          value={newProject.projectLink}
        />
        <Input
          placeholder="Technologies Used"
          name="technologiesUsed"
          onChange={(e) => handleChange(e, setNewProject)}
          value={newProject.technologiesUsed}
        />
      </form>

      {/* Certifications / Awards Section */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setCertificationsArr([...certificationsArr, newCertification]);
          setNewCertification({
            title: "",
            issuer: "",
            link: "",
            date: null,
          });
        }}
        className="flex flex-col gap-2"
        title="Certifications / Awards (optional)"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl truncate">Certifications / Awards</h1>
          <button type="submit">
            <Plus className="cursor-pointer hover:text-neutral-400" />
          </button>
        </div>
        <Input
          placeholder="Title"
          name="title"
          onChange={(e) => handleChange(e, setNewCertification)}
          value={newCertification.title}
        />
        <Input
          placeholder="Issuer"
          name="issuer"
          onChange={(e) => handleChange(e, setNewCertification)}
          value={newCertification.issuer}
        />
        <Input
          placeholder="Link"
          name="link"
          onChange={(e) => handleChange(e, setNewCertification)}
          value={newCertification.link}
        />
        <div>
          <label className="mb-1 block text-sm">Assigned Date</label>
          <DatePickerDemo
            onChange={(date: Date | null) =>
              handleDateChange(date, "date", setNewCertification)
            }
          />
        </div>
      </form>

      {/* Hobbies / Interests Section */}
      <div className="mt-6">
        <label className="mb-2 block text-xl font-semibold truncate">
          Hobbies / Interests (optional)
        </label>
        <Input
          placeholder="Hobbies / Interests (comma separated)"
          name="hobbies"
          onChange={(e) => setHobbies(e.target.value)}
          value={hobbies}
        />
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-xl font-semibold truncate">
          Target Role*
        </label>
        <Input
          placeholder="Target Role"
          name="targetRole"
          onChange={(e) => setJobTitle(e.target.value)}
          value={jobTitle}
        />
      </div>

      <Button variant="default" onClick={handleSubmit}>
        {isLoading ? <Loader2 className="animate-spin" /> : "Upload"}
      </Button>

      {/* Display Sections */}
      {personalInfo.name ||
      personalInfo.email ||
      personalInfo.phoneNumber ||
      personalInfo.address ? (
        <div className="mt-8 p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl  mb-4">Personal Information</h2>
          <p>
            <strong>Name:</strong> {personalInfo.name}
          </p>
          <p>
            <strong>Email:</strong> {personalInfo.email}
          </p>
          <p>
            <strong>Phone Number:</strong> {personalInfo.phoneNumber}
          </p>
          {personalInfo.address && (
            <p>
              <strong>Address:</strong> {personalInfo.address}
            </p>
          )}
          {personalInfo.linkedInProfile && (
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a
                href={personalInfo.linkedInProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {personalInfo.linkedInProfile}
              </a>
            </p>
          )}
          {personalInfo.githubProfile && (
            <p>
              <strong>GitHub:</strong>{" "}
              <a
                href={personalInfo.githubProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {personalInfo.githubProfile}
              </a>
            </p>
          )}
          {personalInfo.portfolioURL && (
            <p>
              <strong>Portfolio:</strong>{" "}
              <a
                href={personalInfo.portfolioURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {personalInfo.portfolioURL}
              </a>
            </p>
          )}
        </div>
      ) : null}
      {skillArr.length > 0 && (
        <div className="p-2 border rounded-lg shadow-sm flex flex-col gap-2">
          <h2 className="text-xl">Skills</h2>
          {skillArr.map((skill, index) => (
            <div key={index} className="p-4 border rounded-md">
              <p>
                <strong>Skill Type:</strong> {skill.type}
              </p>
              <p>
                <strong>Skills:</strong> {skill.names}
              </p>
            </div>
          ))}
        </div>
      )}

      {educationArr.length > 0 && (
        <div className=" p-2 border rounded-lg shadow-sm flex  flex-col gap-2">
          <h2 className="text-xl ">Education</h2>
          {educationArr.map((edu, index) => (
            <div key={index} className=" p-4 border rounded-md ">
              <p>
                <strong>Course:</strong> {edu.course}
              </p>
              <p>
                <strong>Institution:</strong> {edu.institutionName}
              </p>
              <p>
                <strong>Location:</strong> {edu.educationLocation}
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                {edu.educationStartDate?.toDateString() || "Not specified"} -{" "}
                {edu.educationEndDate?.toDateString() || "Not specified"}
              </p>
              <p>
                <strong>CGPA:</strong> {edu.cgpa}
              </p>
            </div>
          ))}
        </div>
      )}

      {workExperienceArr.length > 0 && (
        <div className=" p-2 border rounded-lg shadow-sm flex  flex-col gap-2">
          <h2 className="text-xl  ">Work Experience</h2>
          {workExperienceArr.map((work, index) => (
            <div key={index} className=" p-4 border rounded-md ">
              <p>
                <strong>Company:</strong> {work.companyName}
              </p>
              <p>
                <strong>Role:</strong> {work.role}
              </p>
              <p>
                <strong>Duration:</strong>{" "}
                {work.workExperienceStartDate?.toDateString() ||
                  "Not specified"}{" "}
                -{" "}
                {work.workExperienceEndDate?.toDateString() || "Not specified"}
              </p>
              <p>
                <strong>Responsibilities:</strong> {work.responsibilities}
              </p>
            </div>
          ))}
        </div>
      )}

      {projectsArr.length > 0 && (
        <div className=" p-2 border rounded-lg shadow-sm flex  flex-col gap-2">
          <h2 className="text-xl  ">Projects</h2>
          {projectsArr.map((project, index) => (
            <div key={index} className=" p-4 border rounded-md ">
              <p>
                <strong>Project Name:</strong> {project.projectName}
              </p>
              <p>
                <strong>Description:</strong> {project.description}
              </p>
              <p>
                <strong>Link:</strong>{" "}
                <a
                  href={project.projectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {project.projectLink}
                </a>
              </p>
              <p>
                <strong>Technologies:</strong> {project.technologiesUsed}
              </p>
            </div>
          ))}
        </div>
      )}

      {certificationsArr.length > 0 && (
        <div className=" p-2 border rounded-lg shadow-sm flex  flex-col gap-2">
          <h2 className="text-xl  ">Certifications / Awards</h2>
          {certificationsArr.map((cert, index) => (
            <div key={index} className=" p-4 border rounded-md ">
              <p>
                <strong>Title:</strong> {cert.title}
              </p>
              <p>
                <strong>Issuer:</strong> {cert.issuer}
              </p>
              <p>
                <strong>Link:</strong>{" "}
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {cert.link}
                </a>
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {cert.date?.toDateString() || "Not specified"}
              </p>
            </div>
          ))}
        </div>
      )}

      {hobbies && (
        <div className=" p-2 border rounded-lg shadow-sm flex  flex-col gap-2">
          <h2 className="text-xl ">Hobbies / Interests</h2>
          <p className="p-4 border rounded-md">{hobbies}</p>
        </div>
      )}

      {
        jobTitle && (
          <div className=" p-2 border rounded-lg shadow-sm flex  flex-col gap-2">
            <h2 className="text-xl ">Target Role</h2>
            <p className="p-4 border rounded-md">{jobTitle}</p>
          </div>
        ) /* Render the Target Role section only if jobTitle is not empty */
      }
    </div>
  );

  return <>{content}</>;
};

export default ManualForm;
