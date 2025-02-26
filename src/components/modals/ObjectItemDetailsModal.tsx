// import React, { useContext, useState } from "react";
// import { Modal, View, TouchableOpacity } from "react-native";
// import NewCategoryModal from "./NewCategoryModal";
// import { MapDataContextType, ObjectItem } from "@/app/utils/types";

// interface ObjectItemDetailsModalProps {
//   open: boolean;
//   onClose: () => void;
//   object: ObjectItem;
//   objectNavigation: () => void;
// }

// function ObjectItemDetailsModal({ open, onClose, object, objectNavigation }: ObjectItemDetailsModalProps) {
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editedCategoryId, setEditedCategoryId] = useState("");
//   const [editedObjectName, setEditedObjectName] = useState("");
//   const [editedObjectDescription, setEditedObjectDescription] = useState("");
//   const [isNewCategoryModalOpen, setNewCategoryModalOpen] = useState(false);
//   const [newCategoryName, setNewCategoryName] = useState("");

//   const { refetchData } = useContext(MapDataContext) as MapDataContextType;

//   const handleEditClick = () => {
//     setEditedCategoryId(object.categoryId);
//     setEditedObjectName(object.name);
//     setEditedObjectDescription(object.desc);
//     setIsEditMode(true);
//   };

//   async function handleSaveChanges() {
//     try {
//       await updateObject(object.id, {
//         id: object.id,
//         categoryId: editedCategoryId,
//         name: editedObjectName,
//         desc: editedObjectDescription,
//       });
//       refetchData();
//       setIsEditMode(false);
//       onClose();
//     } catch (error) {
//       console.error("Error updating object:", error);
//     }
//   }

//   async function handleSaveNewCategory() {
//     try {
//       await createCategory({ name: newCategoryName });
//       setEditedCategoryId(newCategoryName);
//       setNewCategoryName("");
//       refetchData();
//       setNewCategoryModalOpen(false);
//     } catch (error) {
//       console.error("Error creating category:", error);
//     }
//   }

//   async function handleCategoryDelete(categoryId: string) {
//     try {
//       await deleteCategory(categoryId);
//       refetchData();
//     } catch (error) {
//       console.error("Error deleting category:", error);
//     }
//   }

//   return (
//     <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
//         <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10, width: "90%" }}>
//           {isEditMode ? (
//             <ObjectEditView
//               object={object}
//               editedCategoryId={editedCategoryId}
//               setEditedCategoryId={setEditedCategoryId}
//               setNewCategoryModalOpen={setNewCategoryModalOpen}
//               editedObjectName={editedObjectName}
//               setEditedObjectName={setEditedObjectName}
//               handleCategoryDelete={handleCategoryDelete}
//               editedObjectDescription={editedObjectDescription}
//               setEditedObjectDescription={setEditedObjectDescription}
//               handleSaveChanges={handleSaveChanges}
//             />
//           ) : (
//             <ObjectDetailsView object={object} handleEditClick={handleEditClick} objectNavigation={objectNavigation} />
//           )}
//           <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
//             <Text style={{ color: "red", textAlign: "center" }}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       <NewCategoryModal
//         isNewCategoryModalOpen={isNewCategoryModalOpen}
//         setNewCategoryModalOpen={setNewCategoryModalOpen}
//         handleSaveNewCategory={handleSaveNewCategory}
//         newCategoryName={newCategoryName}
//         setNewCategoryName={setNewCategoryName}
//       />
//     </Modal>
//   );
// }

// export default ObjectItemDetailsModal;