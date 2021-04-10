import styled from "styled-components";
import { CubeGrid } from "better-react-spinkit";
function Loading({ disable }) {
  return (
    <LoadingContainer>
      {!disable && <CubeGrid color="#2da639" size={100} />}
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  place-content: center;
`;

export default Loading;
