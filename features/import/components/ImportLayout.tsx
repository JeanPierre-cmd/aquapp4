import InfraTab from "../infra/InfraTab";
import LiteTabs from "./LiteTabs";
import { PlaceholderContent } from "./PlaceholderContent";

export default function ImportLayout() {
  const tabs = [
    {
      id: "infra",
      title: "Infraestructura",
      content: <InfraTab />
    },
    {
      id: "prod",
      title: "Producción",
      content: <PlaceholderContent title="Módulo de Producción" />
    },
    {
      id: "compl",
      title: "Cumplimiento",
      content: <PlaceholderContent title="Módulo de Cumplimiento" />
    },
    {
      id: "evid",
      title: "Evidencias (PDF/JPG)",
      content: <PlaceholderContent title="Módulo de Evidencias" />
    },
    {
      id: "logs",
      title: "Logs",
      content: <PlaceholderContent title="Logs de Importación" />
    },
  ];

  return <LiteTabs tabs={tabs} defaultTab="infra" />;
}
