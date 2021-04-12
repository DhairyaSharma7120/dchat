import styled from "styled-components";
import { Wave } from "better-react-spinkit";
import styles from "../styles/loading.module.css"
function Loading({ disable }) {
  return (
    <LoadingContainer>
      {!disable && <Wave color="#37caec" className={styles.loading} size={100} />}
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
