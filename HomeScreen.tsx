import { View, Text, Share } from "react-native";
import { faker } from "@faker-js/faker";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import {
  ContextMenuView,
  OnPressMenuItemEvent,
  OnPressMenuItemEventObject,
  MenuConfig,
  MenuElementConfig,
} from "react-native-ios-context-menu";

const ShareAction: MenuElementConfig = {
  actionKey: "share",
  actionTitle: "Share",
  icon: {
    type: "IMAGE_SYSTEM",
    imageValue: {
      systemName: "square.and.arrow.up",
    },
  },
};

const CopyAction: MenuElementConfig = {
  actionKey: "repost",
  actionTitle: "Repost",
  icon: {
    type: "IMAGE_SYSTEM",
    imageValue: {
      systemName: "repeat.circle.fill",
    },
  },
};

const EditAction: MenuElementConfig = {
  actionKey: "edit",
  actionTitle: "Edit",
  icon: {
    type: "IMAGE_SYSTEM",
    imageValue: {
      systemName: "pencil",
    },
  },
};

type Row = {
  id: string;
  text: string;
  color: string;
};

function Component() {
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const navigation = useNavigation();
  const [data, setData] = React.useState<Row[]>([]);

  const onPressMenuItem = React.useCallback(
    (event: OnPressMenuItemEventObject) => {
      switch (event.nativeEvent.actionKey) {
        case "share":
          Share.share({
            title: "Share",
            message:
              "https://github.com/dominicstop/react-native-ios-context-menu",
          });
          break;
        case "repost":
          //@ts-ignore
          navigation.navigate("Misc");
          break;
        case "edit":
          //@ts-ignore
          navigation.navigate("Misc");
          break;
      }
    },
    []
  );

  const _render = React.useCallback(
    (info: ListRenderItemInfo<Row>) => {
      return (
        <ContextMenuView
          menuConfig={{
            menuTitle: "Menu",
            menuItems: [ShareAction, CopyAction, EditAction],
          }}
          onPressMenuItem={onPressMenuItem}
        >
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor: info.item.color,
              marginHorizontal: 20,
              marginVertical: 10,
            }}
          >
            <Text>{info.item.text}</Text>
          </View>
        </ContextMenuView>
      );
    },
    [onPressMenuItem]
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setData((rows) => {
        const newRows = [...rows];
        newRows.unshift({
          id: String(rows.length + 1),
          text: faker.lorem.sentence({ min: 3, max: 10 }),
          color: faker.color.human(),
        });
        return newRows;
      });
    }, 2500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={data}
        keyExtractor={(item) => item.id}
        inverted={true}
        contentInsetAdjustmentBehavior="automatic"
        renderItem={_render}
        estimatedItemSize={40}
      />
    </View>
  );
}

export default Component;
