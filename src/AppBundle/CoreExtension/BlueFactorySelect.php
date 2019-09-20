<?php

namespace AppBundle\CoreExtension;

use Pimcore\Model\DataObject\ClassDefinition\Data;
use Pimcore\Model\DataObject\ClassDefinition\Data\ResourcePersistenceAwareInterface;
use Pimcore\Model\DataObject\ClassDefinition\Data\QueryResourcePersistenceAwareInterface;
use Pimcore\Model\DataObject\ClassDefinition\Helper\OptionsProviderResolver;
use Pimcore\Model\DataObject\Traits\SimpleComparisonTrait;
use Pimcore\Model\DataObject\ClassDefinition\Data\Extension;
use Pimcore\Model\Element\ValidationException;
use Pimcore\Model\DataObject;

class BlueFactorySelect extends Data implements ResourcePersistenceAwareInterface, QueryResourcePersistenceAwareInterface
{
    use SimpleComparisonTrait;
    use Extension\ColumnType;
    use Extension\QueryColumnType;

    /**
     * Static type of this element
     *
     * @var string
     */
    public $fieldtype = 'blueFactorySelect';

    /**
     * @var string
     */
    public $select;

    /**
     * Available options to select
     *
     * @var array
     */
    public $options;

    /**
     * @var int
     */
    public $width;

    /**
     * @var string
     */
    public $defaultValue;

    /** Options provider class
     *
     * @var string
     */
    public $optionsProviderClass;

    /** Options provider data
     *
     * @var string
     */
    public $optionsProviderData;

    public $queryColumnType = [
        'select' => 'VARCHAR(190)',
        'title'  => 'VARCHAR(190)'
    ];

    public $columnType = [
        'select' => 'VARCHAR(190)',
        'title'  => 'VARCHAR(190)'
    ];

    /**
     * Type for the generated phpdoc
     *
     * @var string
     */
    public $phpdocType = 'string';

    /**
     * @var bool
     */
    public $dynamicOptions = false;

    /**
     * @return array
     */
    public function getColumnType()
    {
        return $this->columnType;
    }

    /**
     * @return array
     */
    public function getQueryColumnType()
    {
        return $this->queryColumnType;
    }

    /**
     * @return array
     */
    public function getOptions()
    {
        return $this->options;
    }

    /**
     * @param array $options
     *
     * @return $this
     */
    public function setOptions($options)
    {
        $this->options = $options;

        return $this;
    }

    /**
     * @return int
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @param $width
     *
     * @return $this
     */
    public function setWidth($width)
    {
        $this->width = $this->getAsIntegerCast($width);

        return $this;
    }

    /**
     * @param array $data
     * @param       $object
     * @param mixed $params
     *
     * @return array
     * @see ResourcePersistenceAwareInterface::getDataForResource
     *
     */
    public function getDataForResource($data, $object = null, $params = [])
    {
        if ($data) {
            return [
                $this->getName() . '__title' => $data['title'],
                $this->getName() . '__select' => $data['select']
            ];
        }

        return [
            $this->getName() . '__title' => null,
            $this->getName() . '__select' => null
        ];
    }

    /**
     * @param array $data
     * @param       $object
     * @param mixed $params
     *
     * @return array
     * @see ResourcePersistenceAwareInterface::getDataFromResource
     *
     */
    public function getDataFromResource($data, $object = null, $params = [])
    {
        if ($data) {
            return [
                'title' => $data[$this->getName() . '__title'],
                'select' => $data[$this->getName() . '__select']
                ];

        }

        return null;
    }

    /**
     * @param array $data
     * @param        $object
     * @param mixed  $params
     *
     * @return array
     * @see QueryResourcePersistenceAwareInterface::getDataForQueryResource
     *
     */
    public function getDataForQueryResource($data, $object = null, $params = [])
    {
        return $this->getDataForResource($data, $object, $params);
    }

    /**
     * @param array $data
     * @param       $object
     * @param mixed $params
     *
     * @return array
     * @see Data::getDataForEditmode
     *
     */
    public function getDataForEditmode($data, $object = null, $params = [])
    {
        return $data;
    }

    /**
     * @param array $data
     * @param       $object
     * @param mixed $params
     *
     * @return array
     * @see Data::getDataFromEditmode
     *
     */
    public function getDataFromEditmode($data, $object = null, $params = [])
    {
        return $data;
    }

    /**
     * @param mixed $data
     *
     * @return bool
     */
    public function isEmpty($data)
    {
        if (empty($data)) {
            return true;
        }

        return false;
    }

    /**
     * @param array $data
     * @param       $object
     * @param mixed $params
     *
     * @return array
     * @see Data::getVersionPreview
     *
     */
    public function getVersionPreview($data, $object = null, $params = [])
    {
        return $data;
    }

    /** True if change is allowed in edit mode.
     *
     * @param string $object
     * @param mixed  $params
     *
     * @return bool
     */
    public function isDiffChangeAllowed($object, $params = [])
    {
        return true;
    }

    /**
     * Checks if data is valid for current data field
     *
     * @param mixed $data
     * @param bool  $omitMandatoryCheck
     *
     * @throws \Exception
     */
    public function checkValidity($data, $omitMandatoryCheck = false)
    {
        if (!$omitMandatoryCheck && $this->getMandatory() && $this->isEmpty($data)) {
            throw new ValidationException('Empty mandatory field [ ' . $this->getName() . ' ]');
        }
    }

    /**
     * @return string
     */
    public function getDefaultValue()
    {
        return $this->defaultValue;
    }

    /**
     * @param string $defaultValue
     */
    public function setDefaultValue($defaultValue)
    {
        $this->defaultValue = $defaultValue;
    }

    /**
     * @return string
     */
    public function getOptionsProviderClass()
    {
        return $this->optionsProviderClass;
    }

    /**
     * @param string $optionsProviderClass
     */
    public function setOptionsProviderClass($optionsProviderClass)
    {
        $this->optionsProviderClass = $optionsProviderClass;
    }

    /**
     * @return string
     */
    public function getOptionsProviderData()
    {
        return $this->optionsProviderData;
    }

    /**
     * @param string $optionsProviderData
     */
    public function setOptionsProviderData($optionsProviderData)
    {
        $this->optionsProviderData = $optionsProviderData;
    }

    public function enrichFieldDefinition($context = [])
    {
        return $this;
    }

    public function enrichLayoutDefinition($object, $context = [])
    {
        return $this;
    }

    /**
     * @param       $data
     * @param null  $object
     * @param array $params
     *
     * @return array
     */
    public function getDataForGrid($data, $object = null, $params = [])
    {
        return $data;
    }

    /**
     * @return string
     */
    public function getSelect()
    {
        return $this->select;
    }

    /**
     * @param string $select
     *
     * @return $this
     */
    public function setSelect($select)
    {
        $this->select = $select;

        return $this;
    }
}
