// import React from "react";
// import { useState } from "react";
// import styled from "styled-components";

// interface ButtonOutlineProps {
//   link?: string;
//   text: string;
// }

// const Button = (props) => {
//   props.$isLink
//     ? styled.a`
//         width: 100px;
//       `
//     : styled.button`
//         width: 200px;
//       `;
// };

// export const ButtonOutline: React.FC = (
//   props: ButtonOutlineProps
// ): JSX.Element => {
//   const { link, text } = props;
//   const [isLink, setIsLink] = useState(link !== undefined);

//   return <Button $isLink={isLink}>{text}</Button>;
// };
