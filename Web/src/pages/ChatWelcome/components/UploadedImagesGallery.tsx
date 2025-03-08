import React from 'react';
import { Image as AntdImage } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

interface UploadedImagesGalleryProps {
  images: Array<{ url: string; file: File }>;
  onRemoveImage: (index: number) => void;
}

const UploadedImagesGallery: React.FC<UploadedImagesGalleryProps> = ({ 
  images, 
  onRemoveImage 
}) => {
  if (images.length === 0) {
    return null;
  }

  return (
    <div className="h-20 flex flex-col justify-center items-center">
      <div className='flex flex-row h-16 max-w-3xl pl-2 w-full'>
        {images.map((image, index) => (
          <div key={index} className="relative group mr-4 h-16 w-16">
            <AntdImage 
              alt=''
              className='block border h-full w-full rounded-md object-cover cursor-pointer'
              height={64}
              width={64}
              src={image.url}
              preview={{
                mask: false
              }}
            />
            <div
              className="absolute bg-white rounded-full -top-2 -right-2 cursor-pointer hidden group-hover:block"
              onClick={() => onRemoveImage(index)}
            >
              <CloseOutlined className='w-5 h-5' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedImagesGallery; 