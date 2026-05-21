import { Project } from "../types/project";

export const useProjects = () => {
  const t = (key: string) => key;
  const projects: Project[] = [
    {
      name: t("projects.spotify2ytMusic.name"),
      link: "#",
      image: "/img/projects/spotify2yt.jpg",
      description: t("projects.spotify2ytMusic.description"),
      status: "pending",
    },
    {
      name: t("projects.trello.name"),
      link: "#",
      image: "/img/projects/trello.png",
      description: t("projects.trello.description"),
      status: "pending",
    },
    {
      name: t("projects.paint95.name"),
      link: "#",
      image: "/img/projects/paint95.png",
      description: t("projects.paint95.description"),
      status: "pending",
    },
    {
      name: t("projects.urlShortener.name"),
      link: "#",
      image: "/img/projects/shortener.png",
      description: t("projects.urlShortener.description"),
      status: "pending",
    },
    {
      name: t("projects.hostal.name"),
      link: "#",
      image: "/img/projects/hostal.jpg",
      description: t("projects.hostal.description"),
      status: "pending",
    },
    {
      name: t("projects.wirelessPedal.name"),
      link: "#",
      image: "/img/projects/pedal.jpg",
      description: t("projects.wirelessPedal.description"),
      status: "pending",
    },
    {
      name: t("projects.restaurantMenu.name"),
      link: "#",
      image: "/img/projects/menu-restaurant.webp",
      description: t("projects.restaurantMenu.description"),
      status: "pending",
    },
    {
      name: t("projects.onlineGame.name"),
      link: "#",
      image: "/img/projects/online-game.jpg",
      description: t("projects.onlineGame.description"),
      status: "pending",
    },
  ];
  return { projects };
};
