import styled from "@emotion/styled";

export const PageContainer = styled.div`
  width: calc(100% - 6rem);
  height: calc(100% - 9.8rem);
  padding: 3rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;

  form {
    display: flex;
    justify-content: center;
    width: 70%;
    margin: 0 auto;
  }

  @media (max-width: 40rem) {
    padding: 9rem 2rem 4rem 2rem;
    width: calc(100% - 4rem);
    height: calc(100% - 17rem);

    form {
      width: 100%;
    }

    h2 {
      font-size: 2.75rem;
    }
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #e4efef;
  }

  &::-webkit-scrollbar-thumb {
    background: #1d388f61;
    border-radius: 2px;
  }
`;
