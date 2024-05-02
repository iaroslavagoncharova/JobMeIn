import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InstructionContext = createContext({
  instructions: {},
  allInstructionsSeen: false,
  markInstructionAsSeen: (page: string) => {},
});

export const InstructionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [instructions, setInstructions] = useState({});
  const [allInstructionsSeen, setAllInstructionsSeen] = useState(false);

  useEffect(() => {
    // Load instructions status from AsyncStorage
    AsyncStorage.getItem('instructions').then((data) => {
      if (data) {
        setInstructions(JSON.parse(data));
      } else {
        // Initialize instructions state if not found in AsyncStorage
        const initialInstructionsState = {
          YourComponent1: false,
          YourComponent2: false,
          // Add other component keys as needed
        };
        setInstructions(initialInstructionsState);
        AsyncStorage.setItem(
          'instructions',
          JSON.stringify(initialInstructionsState),
        );
      }
    });
  }, []);

  useEffect(() => {
    // Check if all instructions have been seen
    const seenAll = Object.values(instructions).every((seen) => seen);
    if (seenAll) {
      setAllInstructionsSeen(true);
    }
  }, [instructions]);

  const markInstructionAsSeen = (page: any) => {
    setInstructions((prevState) => ({
      ...prevState,
      [page]: true,
    }));
  };

  useEffect(() => {
    // Save instructions status to AsyncStorage
    AsyncStorage.setItem('instructions', JSON.stringify(instructions));
  }, [instructions]);

  return (
    <InstructionContext.Provider
      value={{
        instructions,
        allInstructionsSeen,
        markInstructionAsSeen,
      }}
    >
      {children}
    </InstructionContext.Provider>
  );
};

export default InstructionContext;
