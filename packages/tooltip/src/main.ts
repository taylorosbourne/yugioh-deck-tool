import "reflect-metadata";
import "./styles/tooltip.scss";
import { getLogger } from "../../core/src/main";

const TOOLTIP_CONTAINER_ID = "cardTooltipContainer";

const logger = getLogger("tooltip");

// document.addEventListener("readystatechange", () => {
//     if (document.getElementById(TOOLTIP_CONTAINER_ID) == null) {
//         logger.debug("Setting up card tooltip.");
//         const context = document.body;
//         const tooltipContainerElement = document.createElement("div");
//         tooltipContainerElement.id = TOOLTIP_CONTAINER_ID;
//         context.appendChild(tooltipContainerElement);
//         bindTooltipHandlers(context, tooltipContainerElement);
//     }
// });
