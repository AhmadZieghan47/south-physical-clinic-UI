import { all_routes } from "../../../feature-module/routes/all_routes";

const routes = all_routes;

export const SidebarData = [
  {
    tittle: "Main Menu",
    icon: "airplay",
    showAsTab: true,
    separateRoute: false,
    submenuItems: [
      {
        label: "Dashboard",
        link: "index",
        submenu: false,
        showSubRoute: false,
        icon: "layout-dashboard",
        base: "dashboard",
        materialicons: "start",
        dot: true,
        submenuItems: [],
      },
      {
        label: "Patients",
        link: "index",
        submenu: true,
        showSubRoute: false,
        icon: "user-heart",
        base: "Patients",
        materialicons: "start",
        dot: true,
        submenuItems: [
          { label: "Patients", link: routes.patients },
          { label: "Patient Details", link: routes.patientDetails },
          { label: "Create Patient", link: routes.createPatient },
          { label: "Patient Create Wizard", link: routes.patientCreateWizard },
        ],
      },
      {
        label: "Appointments",
        link: "index",
        submenu: true,
        showSubRoute: false,
        icon: "calendar-check",
        base: "Patients",
        materialicons: "start",
        dot: true,
        submenuItems: [
          { label: "Appointments", link: routes.appointments },
          { label: "New Appointment", link: routes.newAppointment },
          { label: "Calendar", link: routes.appointmentCalendar },
        ],
      },
    ],
  },
];
