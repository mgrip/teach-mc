import React, { useState, ReactNode, useRef, Fragment } from "react";
import {
  Deck,
  Slide,
  Text,
  FlexBox,
  FullScreen,
  Box,
  Progress,
  Stepper,
  Appear,
  Notes,
} from "spectacle";
import styled, { ThemeProvider } from "styled-components";
import theme from "./theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faArrowRight,
  faArrowLeft,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";
import { faHtml5, faCss3, faJs } from "@fortawesome/free-brands-svg-icons";
import { useTransition, animated, useChain, useSpring } from "react-spring";

const StyledTemplate = styled.div`
  display: flex;
  justify-content: space-between;
  bottom: 0;
  width: 100%;
  position: absolute;
  pointer-events: auto;
`;

function Template() {
  const [fullScreenVisible, setFullScreenVisible] = useState(false);
  return (
    <StyledTemplate
      onMouseEnter={() => setFullScreenVisible(true)}
      onMouseLeave={() => setFullScreenVisible(false)}
    >
      <Box padding="0 1em">
        {fullScreenVisible && (
          <FullScreen size={40} color={theme.colors.primary} />
        )}
      </Box>
      <Box padding="1em">
        <Progress size={10} color={theme.colors.primary} />
      </Box>
    </StyledTemplate>
  );
}

const StyledBrowser = styled.div`
  background-color: ${({ theme }) => theme.colors.gray.one};
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .urlbar {
    border-radius: 12px;
    padding: 12px;
    background-color: ${({ theme }) => theme.colors.gray.two};
    font-family: ${({ theme }) => theme.fonts.monospace};
    color: ${({ theme }) => theme.colors.gray.three};
    font-size: 14px;
  }

  .spinner {
    color: ${({ theme }) => theme.colors.tertiary};
    font-size: 56px;
    align-self: center;
    margin-top: 150px;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 36px;
    padding: 100px;
    font-family: ${({ theme }) => theme.fonts.text};
    color: ${({ theme }) => theme.colors.tertiary};

    .logo {
      width: 200px;
    }
  }
`;

function Browser({ state }: { state: "not-started" | "loading" | "done" }) {
  const spinnerTransitionRef = useRef();
  const contentTransitionRef = useRef();
  const spinnerTransitions = useTransition(state === "loading", null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    // @ts-ignore
    ref: spinnerTransitionRef,
  });
  const contentTransitions = useTransition(state === "done", null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    // @ts-ignore
    ref: contentTransitionRef,
  });
  useChain(
    // @ts-ignore
    state === "done"
      ? [spinnerTransitionRef, contentTransitionRef]
      : [contentTransitionRef, spinnerTransitionRef]
  );
  return (
    <StyledBrowser>
      <div className="urlbar">https://www.mentorcollective.org</div>
      {spinnerTransitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.span key={key} className="spinner" style={props}>
              <FontAwesomeIcon spin={true} icon={faSpinner} />
            </animated.span>
          )
      )}
      {contentTransitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div key={key} className="content" style={props}>
              welcome to
              <img className="logo" src="/mc_logo_full.png" alt="logo" />
            </animated.div>
          )
      )}
    </StyledBrowser>
  );
}

const StyledCalculator = styled.div`
  width: 40%;
  height: 80%;
  background-color: ${({ theme }) => theme.colors.gray.three};
  border: ${({ theme }) => `8px solid ${theme.colors.gray.four}`};
  border-radius: 40px;
  padding: 16px;
  position: relative;
  top: 60px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.fonts.monospace};
  font-size: 48px;

  .display {
    border-radius: 12px;
    padding: 12px;
    background-color: ${({ theme }) => theme.colors.gray.two};
    color: ${({ theme }) => theme.colors.gray.three};
    box-sizing: border-box;
    flex: 1 0 100%;
    margin-bottom: 8px;
  }

  .button {
    flex: 1 0 30%;
    margin: 8px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.quinary};
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.tertiary};
  }
`;

function Calculator({
  state,
}: {
  state: "not-started" | "draw" | "click" | "update";
}) {
  const numbers = [...Array(9).keys()].map((i) => i + 1);
  const drawTransitions = useTransition(
    ["draw", "click", "update"].includes(state) ? numbers : [],
    null,
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      unique: true,
      trail: 200,
    }
  );
  const clickButtonStyles = useSpring({
    backgroundColor:
      state === "click" ? theme.colors.gray.four : theme.colors.quinary,
    color: state === "click" ? theme.colors.primary : theme.colors.tertiary,
  });
  const updateDisplayStyles = useSpring({
    opacity: state === "update" ? 1 : 0,
  });
  return (
    <StyledCalculator>
      {["draw", "click", "update"].includes(state) && (
        <Fragment>
          <div className="display">
            <animated.span style={updateDisplayStyles}>3</animated.span>
          </div>
          {drawTransitions.map(({ item, props, key }) => (
            <animated.div
              style={item === 3 ? { ...props, ...clickButtonStyles } : props}
              key={key}
              className="button"
            >
              {item}
            </animated.div>
          ))}
        </Fragment>
      )}
    </StyledCalculator>
  );
}

const StyledCalculatorProgram = styled.div`
  width: 40%;
  height: 60%;
  background-color: ${({ theme }) => theme.colors.gray.two};
  border-radius: 8px;
  padding: 16px;
  position: relative;
  top: 60px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.fonts.monospace};
  font-size: 24px;
  color: ${({ theme }) => theme.colors.gray.four};

  .instruction {
    margin-left: 32px;
  }

  .arrow {
    position: absolute;
  }
`;

function CalculatorProgram({
  state,
}: {
  state: "not-started" | "draw" | "click" | "update";
}) {
  const arrowHeight = useSpring({
    top: state === "draw" ? "25%" : state === "click" ? "47%" : "72%",
  });
  const instructionOneColor = useSpring({
    color: state === "draw" ? theme.colors.gray.four : theme.colors.gray.three,
  });
  const instructionTwoColor = useSpring({
    color: state === "click" ? theme.colors.gray.four : theme.colors.gray.three,
  });
  const instructionThreeColor = useSpring({
    color:
      state === "update" ? theme.colors.gray.four : theme.colors.gray.three,
  });
  return (
    <StyledCalculatorProgram>
      <div className="filename">calculator.app</div>
      <animated.div style={instructionOneColor} className="instruction">
        draw the display + buttons
      </animated.div>
      <animated.div style={instructionTwoColor} className="instruction">
        when a button is clicked
      </animated.div>
      <animated.div style={instructionThreeColor} className="instruction">
        then update the display with that number
      </animated.div>
      {["draw", "click", "update"].includes(state) && (
        <animated.span className="arrow" style={arrowHeight}>
          <FontAwesomeIcon icon={faArrowRight} />
        </animated.span>
      )}
    </StyledCalculatorProgram>
  );
}

function JustText({ children }: { children: ReactNode }) {
  return (
    <FlexBox height="100%" flexDirection="column">
      <Text fontFamily={theme.fonts.monospace}>{children}</Text>
    </FlexBox>
  );
}

const CalculatorWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  justify-content: space-between;
`;

const StyledWebExample = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  .internet {
    flex: 1;
    display: flex;
    flex-direction: row;
    color: ${({ theme }) => theme.colors.primary};
    justify-content: space-between;

    .cloud {
      font-size: 240px;
      margin-right: 36px;
      margin-top: 82px;
    }

    .arrows {
      font-size: 120px;
      margin-top: 180px;
      margin-left: 180px;

      .request {
        transform: rotate(-20deg);
        display: inline-block;
      }

      .response {
        margin-top: 36px;
        margin-left: 24px;
        transform: rotate(-20deg);
        display: inline-block;
      }
    }

    .responseData {
      position: relative;
      .doc {
        position: absolute;
        background-color: ${({ theme }) => theme.colors.gray.two};
        border-radius: 8px;
        padding: 8px;
        height: 80px;
        width: 60px;
        font-family: ${({ theme }) => theme.fonts.monospace};
        color: ${({ theme }) => theme.colors.gray.four};
        font-size: 12px;
        border: ${({ theme }) => `1px solid ${theme.colors.gray.four}`};

        &.html {
          top: 0;
          left: 0;
        }
        &.css {
          top: 24px;
          left: 24px;
        }
        &.js {
          top: 48px;
          left: 48px;
        }
      }
    }
  }
`;

function WebExample({ state }: { state: "not-started" | "loading" | "done" }) {
  const browserStyle = useSpring(
    ["loading", "done"].includes(state)
      ? {
          width: "40%",
          height: "100%",
          top: "200px",
          position: "relative",
          config: { friction: 40 },
        }
      : {
          width: "70%",
          height: "100%",
          top: "60px",
          position: "relative",
          config: { friction: 40 },
        }
  );
  const requestStyle = useSpring({
    opacity: ["loading", "done"].includes(state) ? 1 : 0,
  });
  const responseStyle = useSpring({
    opacity: ["done"].includes(state) ? 1 : 0,
  });
  return (
    <StyledWebExample>
      <animated.div style={browserStyle}>
        <Browser state={state} />
      </animated.div>
      <div className="internet">
        <div className="arrows">
          <animated.span style={requestStyle} className="request">
            <FontAwesomeIcon icon={faArrowRight} />
          </animated.span>
          <br />
          <animated.span style={responseStyle} className="response">
            <FontAwesomeIcon icon={faArrowLeft} />
          </animated.span>
          <animated.div style={responseStyle} className="responseData">
            <div className="doc html">html</div>
            <div className="doc css">css</div>
            <div className="doc js">js</div>
          </animated.div>
        </div>
        <animated.span style={requestStyle} className="cloud">
          <FontAwesomeIcon icon={faCloud} />
        </animated.span>
      </div>
    </StyledWebExample>
  );
}

const Languages = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  height: 100%;

  .language {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 80%;
    align-items: center;

    font-family: ${({ theme }) => theme.fonts.monospace};
    font-size: 36px;

    .name {
      .fullname {
        font-size: 24px;
      }
    }

    .icon {
      font-size: 124px;
    }
  }
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Deck theme={theme} template={Template}>
        <Slide>
          <JustText>teach@mc</JustText>
        </Slide>
        <Slide>
          <JustText>lets talk about web applications</JustText>
          <Notes>
            <ul>
              <li>only 20 mins,keep high level</li>
              <li>
                fun to give you all a view into what we do on the engineering
                team
              </li>
              <li>we use the interet all the time</li>
              <li>goals: walk you through my mental model, write some code</li>
              <li>recruit you all to join the engineering team</li>
            </ul>
          </Notes>
        </Slide>
        <Slide>
          <JustText>web page? web app?</JustText>
          <Notes>
            <ul>
              <li>web site/web page/web app</li>
              <li>overloaded terms</li>
              <li>internet was first built to view documents over network</li>
              <li>all built on the same tech, varying complexity</li>
            </ul>
          </Notes>
        </Slide>
        <Slide>
          <Box />
          <Stepper values={["not-started", "loading", "done"]}>
            {(value) => (
              <div
                style={{
                  width: "70%",
                  height: "100%",
                  top: "60px",
                  position: "relative",
                }}
              >
                <Browser state={value} />
              </div>
            )}
          </Stepper>
          <Notes>
            <ul>
              <li>enter a url</li>
              <li>click enter</li>
              <li>takes a bit to load</li>
              <li>something magically appears</li>
            </ul>
          </Notes>
        </Slide>
        <Slide>
          <FlexBox height="100%" flexDirection="column">
            <Text fontFamily={theme.fonts.monospace}>
              web apps are just computer programs
            </Text>
            <Appear
              elementNum={0}
              transitionEffect={{ to: { opacity: 1 }, from: { opacity: 0 } }}
            >
              <Text fontFamily={theme.fonts.monospace} fontSize="24px">
                (or, a list of instructions to tell a computer what to do)
              </Text>
            </Appear>
          </FlexBox>
        </Slide>
        <Slide>
          <Box />
          <Stepper values={["not-started", "draw", "click", "update"]}>
            {(value) => (
              <CalculatorWrapper>
                <Calculator state={value} />
                <CalculatorProgram state={value} />
              </CalculatorWrapper>
            )}
          </Stepper>
        </Slide>
        <Slide>
          <Box />
          <Stepper values={["not-started", "loading", "done"]}>
            {(value) => <WebExample state={value} />}
          </Stepper>
          <Notes>
            <ul>
              <li>enter url, click enter</li>
              <li>make request over the internet</li>
              <li>
                internet is just a bunch of computers connected together, all
                over the world (billions of them)
              </li>
              <li>
                url says exactly which computer you're trying to connect to
              </li>
              <li>should get some stuff back</li>
              <li>stuff = code</li>
              <li>can think of it as download an app from the app store</li>
            </ul>
          </Notes>
        </Slide>
        <Slide>
          <JustText>
            <a
              style={{ color: theme.colors.primary }}
              href="https://www.mentorcollective.org"
              target="_blank"
            >
              www.mentorcollective.org
            </a>
          </JustText>
        </Slide>
        <Slide>
          <Text fontFamily={theme.fonts.monospace}>programming a web app</Text>
          <Languages>
            <div className="language">
              <FontAwesomeIcon className="icon" icon={faHtml5} />
              <div className="name">
                html
                <div className="fullname">(hyper text markup language)</div>
              </div>
              layout/display
            </div>
            <div className="language">
              <FontAwesomeIcon className="icon" icon={faCss3} />
              <div className="name">
                css
                <div className="fullname">(cascading style sheets)</div>
              </div>
              styling
            </div>
            <div className="language">
              <FontAwesomeIcon className="icon" icon={faJs} />
              <div className="name">
                js
                <div className="fullname">(javascript)</div>
              </div>
              interactivity
            </div>
          </Languages>
        </Slide>
        <Slide>
          <JustText>
            <a
              style={{ color: theme.colors.primary }}
              href="https://codesandbox.io/s/teachmc-yuy8n?file=/index.html"
              target="_blank"
            >
              lets start coding
            </a>
          </JustText>
        </Slide>
      </Deck>
    </ThemeProvider>
  );
}
export default App;
