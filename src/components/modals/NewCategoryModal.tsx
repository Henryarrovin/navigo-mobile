import React from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";

interface NewCategoryModalProps {
  isNewCategoryModalOpen: boolean;
  setNewCategoryModalOpen: (value: boolean) => void;
  handleSaveNewCategory: () => void;
  newCategoryName: string;
  setNewCategoryName: (value: string) => void;
}

const NewCategoryModal: React.FC<NewCategoryModalProps> = ({
  isNewCategoryModalOpen,
  setNewCategoryModalOpen,
  handleSaveNewCategory,
  newCategoryName,
  setNewCategoryName,
}) => {
  return (
    <Modal
      visible={isNewCategoryModalOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setNewCategoryModalOpen(false)}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Create New Category</Text>
          <TextInput
            style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 }}
            placeholder="New Category Name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
          />
          <TouchableOpacity onPress={handleSaveNewCategory} style={{ backgroundColor: "green", padding: 10, borderRadius: 5 }}>
            <Text style={{ color: "white", textAlign: "center" }}>Save New Category</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default NewCategoryModal;