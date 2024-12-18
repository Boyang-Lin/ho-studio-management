interface ProjectStatusBadgeProps {
  status: string;
}

export const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Design Stage":
        return "bg-blue-100 text-blue-800";
      case "Coordination Stage":
        return "bg-purple-100 text-purple-800";
      case "Submitted":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "On hold":
        return "bg-orange-100 text-orange-800";
      case "Canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};