import styled from "styled-components";
import { CubeGrid } from "better-react-spinkit";
function Loading({ disable }) {
  return (
    <LoadingContainer>
      {!disable && <CubeGrid color="#2da639" size={100} />}
    </LoadingContainer>
  );
}
const LoadingContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  place-content: center;
`;

const LoadingSpinner = styled.img`
    
  display: inline-block;
  width: 400px;
  height: 300px;
    /* background-color: white; */
  /* :after{
    content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #2da639;
  border-color: #2da639 transparent #2da639 transparent; */
  animation: lds-dual-ring 1.2s linear infinite;
  }

  @keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;

export default Loading;
