import React from "react";
import { useEffect, useState, useRef } from "react";
import { useAuthContext } from "components/auth/useAuthContext";
import { Outlet, matchPath, useLocation } from "react-router-dom";
import { DbChatRoom, UIChatRoom } from "./type";
import { getChatUser, getDbChatrooms } from "./utils";
import { Content } from "components/DashboardContent";
import { Chatroom } from "./Chatroom";
import { Spinner } from "components/Spinner";
import styled from "styled-components";
import { Infos } from "Pages/SendPackage/SendPackage";

export const Wrapper = styled.div`
  height: calc(100vh - 25vh - 25px);
  display: flex;
  gap: 25px;
  border-radius: 10px;
  & > * {
    flex: 1 1 auto;
  }
`;
export const Nav = styled.nav`
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: white;
  padding: 10px;
  position: relative;
  border-radius: 10px;
  @media screen and (min-width: 700px) {
    max-width: 350px;
  }
`;
export const OutletContent = styled.div`
  @media screen and (max-width: 700px) {
    position: fixed;
    width: 96vw;
    top: 10%;
    left: 2vw;
    right: 2vw;
    bottom: 25px;
    z-index: 6;
  }
`;

const Inbox = () => {
  const { user } = useAuthContext();
  const uid = user?.id;
  const pathname = useLocation().pathname;
  /**
   * URLmatch is used to achieve the following on small screens:
   * - hide Outlet when the url is not /inbox/:id
   * - show Outlet when a chatroom is opened and the url is "/inbox/id"
   */
  const URLmatch = matchPath({ path: "/inbox/:id" }, pathname);
  const [chatrooms, setChatrooms] = useState<UIChatRoom[]>([]);
  const [dbChatrooms, setDbChatrooms] = useState<DbChatRoom[]>([]);
  const [status, setStatus] = useState<"searching" | "found" | "not found">(
    "searching"
  );
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const unsubscribeChatrooms = getDbChatrooms(
      uid as string,
      setDbChatrooms,
      setStatus
    );
    return () => {
      unsubscribeChatrooms();
    };
  }, []);

  useEffect(() => {
    if (dbChatrooms.length > 0) {
      setStatus("searching");
      (async () => {
        const _chatrooms = await Promise.all(
          dbChatrooms.map((chatroom) => {
            return getChatUser(chatroom, uid as string);
          })
        );
        setStatus("found");
        setChatrooms([..._chatrooms]);
      })();
    }
    return () => {};
  }, [dbChatrooms]);

  useEffect(() => {
    let mediaQuery = window.matchMedia("(max-width: 700px)");
    //execute on mount the first time
    handleMobileView(mediaQuery);
    //add listen
    mediaQuery.addEventListener("change", handleMobileView);
    // mediaQuery.addListener(handleMobileView);
    function handleMobileView(e: MediaQueryListEvent | MediaQueryList) {
      const outletContent = ref.current as HTMLDivElement;
      if (e.matches) {
        // small screen
        if (URLmatch === null) {
          //The url is not /inbox/:id
          outletContent.style.display = "none";
        } else {
          // The url is /inbox/:id
          outletContent.style.display = "block";
        }
      } else {
        // large screen
        outletContent.style.display = "block";
      }
    }
    return () => {
      mediaQuery.removeEventListener("change", handleMobileView);
    };
  }, [URLmatch]);

  return (
    <Content>
      <Wrapper>
        <Nav>
          {status === "searching" && <Spinner />}
          {status === "found" &&
            chatrooms.map((chatroom) => {
              return (
                <Chatroom
                  key={chatroom.id}
                  chatroom={chatroom}
                  $animationOrder={chatrooms.indexOf(chatroom)}
                />
              );
            })}
          {status === "not found" && <Infos>No Inbox Yet</Infos>}
        </Nav>
        <OutletContent ref={ref}>
          <Outlet />
        </OutletContent>
      </Wrapper>
    </Content>
  );
};

export default Inbox;
