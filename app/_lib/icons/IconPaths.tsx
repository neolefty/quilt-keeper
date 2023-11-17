interface InnerIconProps {
    color: string
}

const Trash = ({ color }: InnerIconProps) => (
    <path
        d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={color}
        fill="none"
    />
)
const RotateLeft = ({ color }: InnerIconProps) => (
    <g
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={color}
        fill="none"
    >
        <path d="M7,17.29A8,8,0,1,0,5.06,11" />
        <polyline data-name="primary" points="3 6 5 11 10 9" />
    </g>
)
const RotateRight = ({ color }: InnerIconProps) => (
    <g
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={color}
        fill="none"
    >
        <path d="M17,17.29A8,8,0,1,1,18.94,11" />
        <polyline points="21 6 19 11 14 9" />
    </g>
)

const Reverse = ({ color }: InnerIconProps) => (
    <g viewBox="0 0 24 24">
        <path
            d="M3 9H16.5C18.9853 9 21 11.0147 21 13.5C21 15.9853 18.9853 18 16.5 18H12M3 9L7 5M3 9L7 13"
            stroke={color}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </g>
)

const D6 = ({ color }: InnerIconProps) => (
    <g
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={color}
        fill="none"
    >
        <rect x={3} y={3} width={18} height={18} rx={4} />
        <path strokeWidth={4} d="M8 8l0 0m4 4l0 0m4 4l0 0z" />
    </g>
)

const Reroute = ({ color }: InnerIconProps) => (
    <g stroke="none" fill={color}>
        <path d="M14.92 17.56c-0.32-0.32-0.88-0.32-1.2 0s-0.32 0.88 0 1.2l0.76 0.76h-3.76c-0.6 0-1.080-0.32-1.6-0.96-0.28-0.36-0.8-0.44-1.2-0.16-0.36 0.28-0.44 0.8-0.16 1.2 0.84 1.12 1.8 1.64 2.92 1.64h3.76l-0.76 0.76c-0.32 0.32-0.32 0.88 0 1.2 0.16 0.16 0.4 0.24 0.6 0.24s0.44-0.080 0.6-0.24l2.2-2.2c0.32-0.32 0.32-0.88 0-1.2l-2.16-2.24z" />
        <path d="M10.72 12.48h3.76l-0.76 0.76c-0.32 0.32-0.32 0.88 0 1.2 0.16 0.16 0.4 0.24 0.6 0.24s0.44-0.080 0.6-0.24l2.2-2.2c0.32-0.32 0.32-0.88 0-1.2l-2.2-2.2c-0.32-0.32-0.88-0.32-1.2 0s-0.32 0.88 0 1.2l0.76 0.76h-3.76c-2.48 0-3.64 2.56-4.68 4.84-0.88 2-1.76 3.84-3.12 3.84h-2.080c-0.48 0-0.84 0.36-0.84 0.84s0.36 0.88 0.84 0.88h2.080c2.48 0 3.64-2.56 4.68-4.84 0.88-2 1.72-3.88 3.12-3.88z" />
        <path d="M0.84 12.48h2.080c0.6 0 1.080 0.28 1.56 0.92 0.16 0.2 0.4 0.32 0.68 0.32 0.2 0 0.36-0.040 0.52-0.16 0.36-0.28 0.44-0.8 0.16-1.2-0.84-1.040-1.8-1.6-2.92-1.6h-2.080c-0.48 0.040-0.84 0.4-0.84 0.88s0.36 0.84 0.84 0.84z" />
    </g>
)

const PaintBrush = ({ color }: InnerIconProps) => (
    <g stroke="none" fill={color} transform="scale(0.0125) rotate(270 960 960)">
        <path d="M517.257 1127.343c72.733 0 148.871 36.586 221.274 107.45 87.455 110.418 114.922 204.135 81.632 278.296-72.733 162.274-412.664 234.897-618.666 259.178 34.609-82.62 75.15-216.88 75.15-394.645 0-97.123 66.47-195.455 157.88-233.689 26.698-11.097 54.494-16.59 82.73-16.59Zm229.404-167.109c54.055 28.895 106.462 65.371 155.133 113.494l13.844 15.6c28.016 35.378 50.649 69.987 70.425 104.155-29.554 26.259-59.878 52.737-90.75 79.545-18.898-35.488-43.069-71.964-72.843-109.319l-4.285-4.834c-48.342-47.683-99.43-83.39-151.727-107.011 26.368-30.653 53.066-61.196 80.203-91.63Zm1046.49-803.133c7.801 7.8 18.129 21.754 16.92 52.187-6.043 155.683-284.338 494.405-740.509 909.266-19.995-32.302-41.969-64.822-67.788-97.453l-22.523-25.27c-49.22-48.671-101.408-88.883-156.012-121.074 350.588-385.855 728.203-734.356 910.254-741.828 30.983-.109 44.497 9.01 59.658 24.172Zm126.678 56.472c2.087-53.615-14.832-99.98-56.142-141.29-34.28-34.279-81.962-51.198-134.588-49.11-304.554 12.414-912.232 683.377-1179.54 996.17-53.616-5.383-106.682 2.088-157.441 23.402-132.61 55.263-225.339 193.038-225.339 334.877 0 268.517-103.935 425.737-104.923 427.275L0 1896.747l110.307-6.153c69.217-3.735 681.29-45.375 810.165-332.46 24.39-54.604 29.225-113.163 15.93-175.239 374.32-321.802 972.11-879.71 983.427-1169.322" />
    </g>
)

const FlipRight = ({ color }: InnerIconProps) => (
    <g
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke={color}
        transform="scale(1.1) translate(-1 -3)"
    >
        <path d="M9.5 20H2L9.5 4V20Z" />
        <path d="M20.125 20H22L21.0625 18" />
        <path d="M16.375 20H14.5V18" />
        <path d="M14.5 12V14" />
        <path d="M18.25 12L19.1875 14" />
        <path d="M16.375 8L14.5 4V8" />
    </g>
)

const FlipLeft = ({ color }: InnerIconProps) => (
    <g transform="translate(24, 0) scale(-1, 1)">
        <FlipRight color={color} />
    </g>
)

const FlipUp = ({ color }: InnerIconProps) => (
    <g transform="rotate(-90 12 12)">
        <FlipRight color={color} />
    </g>
)

const FlipDown = ({ color }: InnerIconProps) => (
    <g transform="rotate(-90 12 12)">
        <FlipLeft color={color} />
    </g>
)

const Plus = ({ color }: InnerIconProps) => (
    <g viewBox="0 0 24 24">
        <path
            d="M4 12L20 12M12 4L12 20z"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="butt"
        />
    </g>
)

const Minus = ({ color }: InnerIconProps) => (
    <g viewBox="0 0 24 24">
        <path
            d="M4 12L20 12z"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="butt"
        />
    </g>
)

export const IconPaths = {
    d6: D6,
    paintBrush: PaintBrush,
    reroute: Reroute,
    rotateLeft: RotateLeft,
    rotateRight: RotateRight,
    reverse: Reverse,
    flipUp: FlipUp,
    flipRight: FlipRight,
    flipDown: FlipDown,
    flipLeft: FlipLeft,
    plus: Plus,
    minus: Minus,
    trash: Trash,
}
