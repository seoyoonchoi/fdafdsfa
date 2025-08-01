import React, { useEffect, useState } from 'react'
import { CategoryTreeResponseDto } from '@/dtos/category/response/Category.response.dto';
import { useCookies } from 'react-cookie';
import { getCategoryTree } from '@/apis/category/category';
import CategoryTree from './CategoryTree';
import UpdateCategory from './UpdateCategory';
import CreateCategory from './CreateCategory';
import Modal from "@/apis/constants/Modal";

function CategoryMain() {
  const [categories, setCategories] = useState<CategoryTreeResponseDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryTreeResponseDto | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [cookies] = useCookies(["accessToken"]);

  const fetchCategories = async () => {
    const token = cookies.accessToken;
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    
    const res = await getCategoryTree("DOMESTIC", token);
    if (res.code === "SU") {
      setCategories(res.data ?? []);
    } else {
      console.error("카테고리 목록 조회 실패:", res.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSelectCategory = (category: CategoryTreeResponseDto) => {
    setSelectedCategory(category);
  };

  const handleSuccess = async () => {
    fetchCategories();
    setSelectedCategory(null);
  };

  return (
    <div>
      <div>
        <button className="" onClick={() => setIsCreateModalOpen(true)}>등록</button>
        <button className="" onClick={fetchCategories}>전체 조회</button>
      </div>

      <CategoryTree onSelect={handleSelectCategory} onEdit={(cat) => setSelectedCategory(cat)} />
      
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}>
            <CreateCategory onSuccess={handleSuccess} />
          </Modal>
      )}

      {selectedCategory && (
        <Modal isOpen={true} onClose={() => setSelectedCategory(null)}>
          <UpdateCategory
            category={selectedCategory}
            onSuccess={handleSuccess}
            mode="update"
          />
        </Modal>
      )}
    </div>
  );
}

export default CategoryMain