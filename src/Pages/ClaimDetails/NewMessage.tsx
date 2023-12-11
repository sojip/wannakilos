import { Button } from "components/Button";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

type NewMessageProps = {
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  setAddMessage: React.Dispatch<React.SetStateAction<boolean>>;
  handleSend: () => Promise<void>;
};

const Content = styled.div`
  position: relative;
  margin-top: 20px;
  min-height: 300px;
  border: solid 1px grey;
  padding: 10px 10px 45px 10px;
  background-color: white;
  border-radius: 10px;
`;

const Icons = styled.div`
  height: 30px;
  border-radius: 10px;
  position: relative;
  top: -35px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 5px;
  & > * {
    cursor: pointer;
  }
`;

export const NewMessage = ({
  setNewMessage,
  setAddMessage,
  handleSend,
}: NewMessageProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleInput(this: HTMLDivElement) {
      const text = this.textContent;
      setNewMessage(text as string);
    }

    contentRef.current?.addEventListener("input", handleInput);
    return () => {
      contentRef.current?.removeEventListener("input", handleInput);
    };
  }, []);
  return (
    <>
      <Content ref={contentRef} contentEditable={true}></Content>
      <Icons>
        <Button onClick={handleSend} value="Send" />
        <i
          className="fa-solid fa-trash fa-xl cancel"
          onClick={() => {
            setAddMessage(false);
          }}
        ></i>
      </Icons>
    </>
  );
};
